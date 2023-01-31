import { DOMCache } from "../types/globals";
import { WeatherRS } from "./interfaces";
import { WeatherIcon, WeatherIcontype } from "./interfaces";

export class Weather {
    domEls: DOMCache;

    days: string[] = [];

    constructor(domElements: DOMCache) {
        this.domEls = domElements;
    }

    initProps(daysOfWeek: string[]): void {
        this.setDays(daysOfWeek);
    }

    setDays(days: string[]): void {
        this.days = days;
    }

    getElements(): DOMCache {
        return this.domEls;
    }

    getLocation(): string {
        return this.domEls.location ? (this.domEls.location as HTMLInputElement).value : "";        
    }

    getDay(): string {
        let day = new Date();
        return this.days[day.getDay()];        
    }

    getDate(): string {
        return new Date().toLocaleDateString("es-ES");
    }

    isValidImage(value: string): value is WeatherIcontype {
        return value in WeatherIcon;
    }    

    changeWeatherIcon(weatherImageRef: string) {
        const weatherMap = [weatherImageRef];
        this.validateImage(weatherMap);
        const mappedWeather = weatherMap.map(weather => WeatherIcon[weather])[0] ?? WeatherIcon["01d"];
        if(typeof mappedWeather[0] === "string") {
            if (this.domEls.weatherIcon) (this.domEls.weatherIcon as HTMLImageElement).src = mappedWeather;
        }
    }

    validateImage(values: string[]): asserts values is WeatherIcontype[] {
        if (!values.every(this.isValidImage)) {
            throw Error('invalid image');    
        }
    }

    configureUI(weather: WeatherRS): void {
        const elements: DOMCache = this.getElements();

        if (elements.weatherTemperature) elements.weatherTemperature.textContent = Math.floor(weather.main.temp).toString() + "ºC";
        if (elements.weatherDescription) elements.weatherDescription.textContent = weather.weather[0].main;
        this.changeWeatherIcon(weather.weather[0].icon ?? '01d');
    
        if (elements.locationTxt) elements.locationTxt.textContent = weather.name;
        if (elements.dateName) elements.dateName.textContent = this.getDay();
        if (elements.dateDay) elements.dateDay.textContent = this.getDate();
    
        if (elements.maxTemperatureTxt) elements.maxTemperatureTxt.textContent = Math.floor(weather.main.temp_max) + " ºC";
        if (elements.minTemperatureTxt) elements.minTemperatureTxt.textContent = Math.floor(weather.main.temp_min) + " ºC";
        if (elements.humidityTxt) elements.humidityTxt.textContent = weather.main.humidity.toString() + " %";
        if (elements.windTxt) elements.windTxt.textContent = weather.wind.speed.toString() + " m/s";
    }  
}