const weatherIcon = document.querySelector('.temp img');
const weatherTemp = document.querySelector('.temp p');
const weatherMainDes = document.querySelector('.info h5');
const weatherDes = document.querySelector('.info p');
const windSpeed = document.querySelector('.wind p');
const locationCity = document.querySelector('.location p');
const weatherDate = document.querySelector('.date p');
const locationBtn = document.querySelector('.locationBtn');
const locationMsg = document.querySelector('.locationMsg');
const dark_light_btn=document.querySelector('.dark-light-btn')
const tableBody=document.querySelector('.forecast table tbody')
const key = "7dde30242039ff3cd27a4263f427c021";
let isLocClicked = false;
let isDarkMode=false;
let lat = 40.730610;
let lon = -73.935242;
let forecastDaily=[];
let map;
let weatherInfo;
let forecastList;

const successCallback = (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    fetching(lat, lon);
};

const errorCallback = (error) => {
    showFailed();
};

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        showFailed();
    }
};

const fetching = (lat, lon) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    )
        .then(r => r.json())
        .then(data => {
            weatherInfo = data;
            getData(weatherInfo);
            getforecastDays(lat,lon)
            if (isLocClicked) showSuccess(weatherInfo.name, weatherInfo.sys.country);
        })
        .catch((r) => {
            showFailed();
        });
};
const getforecastDays = (lat, lon) => {
    if(!forecastList||isLocClicked){
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
        )
            .then(r => r.json())
            .then(data => {
                forecastList=""
                forecastList = data;
                console.log(forecastList)
                forecastAdd(forecastList)
            })
            .catch((r) => {
            });
    }
};
const forecastAdd=(f)=>{
    const forecasts = f.list.map(item =>{
    const date=item.dt_txt.split(' ')[0]
    if(!forecastDaily.includes(date)){
        forecastDaily.push(date)
        icon=item.weather[0].icon,
        iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        temp_max=item.main.temp_max,
        temp_min=item.main.temp_min,
        condition=item.weather[0].main,
        precipitation=item.pop
        wind=item.wind.speed
        const dd=date.split('-')
        const ddd=new Date(dd[0],dd[1]-1,dd[2])
        const row = 
        `<tr>
            <td>
                <div><p>${ddd.toDateString()}</p></div></td>
            <td>
            <div><p>${temp_max}</p>/<p>${temp_min}</p></div>
            </td>
            <td>
            <div><p>${precipitation}</p><span>%</span></div>
            </td>
            <td>
            <div><p>${Math.round(wind)}</p><span>km/h</span></div>
            </td>
            <td>
                <div><img src="${iconUrl}"/><p>${condition}</p></div>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    }
});
}
const getData = (w) => {
    icon= weatherInfo.weather[0].icon;
    iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherTemp.innerText = `${weatherInfo.main.temp}°C`;
    weatherMainDes.innerText = weatherInfo.weather[0].main;
    weatherDes.innerText = weatherInfo.weather[0].description;
    windSpeed.innerText = `${Math.floor(weatherInfo.wind.speed)} km/h`;
    locationCity.innerText = `${w.name}, ${weatherInfo.sys.country}`;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    weatherDate.innerText = date.toDateString();
    forecastDaily.push(formattedDate)    
    setMap(lat, lon);
};
const setMap = (lat, lon) => {
    const mapContainer = document.querySelector('#map');
    if (!map) {
        map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    L.marker([lat, lon]).addTo(map);
};


const showSuccess = (city,country) => {
    const msg =
        `<div class="success">
            <img src="assets/info.svg" alt="">
            <div>
                <h4>Location Obtained:</h4>
                <p>We've got your location in <strong>${city}, ${country}</strong>. Let's check out the latest weather updates for you!</p>
            </div>
        </div>`;
    locationMsg.innerHTML = msg;
    locationMsg.style.display = "flex";
    setTimeout(() => {
        locationMsg.innerHTML = "";
        locationMsg.style.display = "none";
    }, 4000);
};

const showFailed = () => {
    const msg =
        `<div class="failed">
            <img src="assets/warning.svg" alt="">
            <div>
                <h4>Location Access Denied</h4>
                <p>Uh-oh! We can't get your location. Turn on location services to get your local weather updates!</p>
            </div>
        </div>`;
    locationMsg.innerHTML = msg;
    locationMsg.style.display = "flex";
    setTimeout(() => {
        locationMsg.innerHTML = "";
        locationMsg.style.display = "none";
    }, 4000);
};
const dark_light_switch=()=>{
    const dark_Light_Icons=document.querySelectorAll('.dark-light-btn img')
    if (!isDarkMode) {
        theme = 'light';
    } else {
        theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
    dark_Light_Icons.forEach(i=>{
            i.classList.toggle('hidden')
})
}
dark_light_switch()
fetching(lat, lon);
locationBtn.addEventListener('click', () => {
    isLocClicked = true;
    tableBody.innerHTML=""
    forecastDaily=[];
    getLocation();
});
dark_light_btn.addEventListener('click',()=>{
    isDarkMode=!isDarkMode?true:false
    dark_light_switch()
});
