import { WeatherRS } from "../model/interfaces";

export const getWeatherByCity = async (city: string): Promise<WeatherRS> => {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };
    
    // response
    const rsData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ac6f213887b95d0b8171b342e702e112&units=metric`, requestOptions);
    return rsData.json();
}

export const getUserLocation = async (latitude: number, longitude: number): Promise<any> => {
    // const response = await fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng='+${latitude}+','+${longitude}+'&sensor=true`);
    // const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&key=AIzaSyDKHPIT3dfJBXZGBScxQc4ngeiSEP2mT3c`);
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    return response.json();
    // 9.991098197726199,-84.10108864270087
}
