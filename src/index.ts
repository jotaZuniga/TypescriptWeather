import { Weather } from './model/Weather';
import { domCache } from './dom-manipulation/cache';
import { getWeatherByCity, getUserLocation } from './networking/apiCalls';

// Style import
import './styles/main.scss';

const DayOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const WeatherApp = new Weather(domCache);
WeatherApp.initProps(DayOfWeek);

const mainBtn = WeatherApp.getElements().btnClick;

const loadingEffect = () => {
    const loadingEl = document.querySelector('.loading');
    if(!loadingEl) {
        return
    }

    loadingEl.classList.toggle('hide');
}

const resetInput = (value: string) => {
    const locationInput = WeatherApp.getElements().location;
    (locationInput as HTMLInputElement).value = value;
}

const displayWeather = async () => {
    const city = WeatherApp.getLocation();
    if(city) {
        loadingEffect();
        try {
            const weather = await getWeatherByCity(city).then(data => {
                WeatherApp.configureUI(data);
                loadingEffect();
            }).catch(error => console.log(error));            
        } catch (error) {
            alert(error);
        }
    } 
}

const showUserLocation = async() => {
    if (!navigator.geolocation) {
        return
    }

    navigator.geolocation.getCurrentPosition(async (success) => {
        const { coords } = success;
        const location = await getUserLocation(coords.latitude, coords.longitude).then(async(data) => {
            const { province } = data.address;
            loadingEffect();
            try {
                const formatCity = province.replace(' Province', '');
                const weather = await getWeatherByCity(formatCity).then(data => {
                    WeatherApp.configureUI(data);
                    resetInput(formatCity)
                    loadingEffect();
                }).catch(error => console.log(error));
            } catch (error) {
                alert(`City: ${province} wasn't found using Geolocation. Please use a different one`);
            }

        }).catch(error => console.log('ERROR:', error));
    }, error => console.log(error));
}

document.addEventListener('DOMContentLoaded', () => {
    resetInput('');
    showUserLocation();
});


if (mainBtn) mainBtn.addEventListener('click', displayWeather)
