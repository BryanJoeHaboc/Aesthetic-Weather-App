class ConvertLocToGeoCoor {
  constructor(location) {
    this.location = location;
    this._apiKey = "48964d428f15677ab81748401048bf1c";
  }

  async _getObj() {
    return fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${this.location}&limit=1&appid=${this._apiKey}`,
      { mode: "cors" }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  async getCoordinates() {
    const obj = await this._getObj();
    return {
      latitude: obj[0].lat,
      longitude: obj[0].lon,
      name: obj[0].name,
      country: obj[0].country,
    };
  }
}

class Weather {
  constructor({ latitude, longitude }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this._apiKey = "48964d428f15677ab81748401048bf1c";
  }

  async _getWeatherDataUsingLoc() {
    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${this.latitude}&lon=${this.longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=${this._apiKey}`,
      {
        mode: "cors",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  async getWeatherForecast() {
    const obj = await this._getWeatherDataUsingLoc();
    const arr = [];
    for (let i = 0; i < obj.daily.length; i++) {
      const tempObj = {
        feelsLike: obj.daily[i].feels_like,
        humidity: obj.daily[i].humidity,
        temp: obj.daily[i].temp,
        weather: obj.daily[i].weather,
        windSpeed: obj.daily[i].wind_speed,
      };
      arr.push(tempObj);
    }
    return arr;
  }
}

class TimeMethods {
  constructor() {
    this.dateInstance = new Date();
  }
  getTimeOfTheDay() {
    //Morning is from sunrise to 11:59 AM. Sunrise typically occurs around 6 AM.
    //Noon is at 12:00 PM.
    //Afternoon is from 12:01 PM to around 6:00 PM.
    //Evening is from 6:01 PM to 9 PM, or around sunset.
    //Night is from sunset to sunrise, so from 9:01 PM until 5:59 AM.

    const hourMin = parseIt(
      this.dateInstance.getHours().toString() +
        this.dateInstance.getMinutes().toString()
    );

    //
    if (hourMin >= 0 && hourMin <= 659) return "eve";
    else if (hourMin >= 700 && hourMin <= 1159) return "morn";
    else if (hourMin >= 1200 && hourMin <= 1659) return "day";
    else if (hourMin >= 1700 && 2359) return "night";
  }

  getDayOfWeek() {
    const dayArr = [
      "Sunday",
      "Monday",
      "Tueday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayArr[this.dateInstance.getDay()];
  }
}

class WeatherDisplay {}

async function main() {
  const latlong = new ConvertLocToGeoCoor("Manila");
  const geoData = await latlong.getCoordinates();
  const weeatherData = new Weather(geoData);
}

main();
