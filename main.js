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
    this._dateInstance = new Date();
    this._dayArr = [
      "Sunday",
      "Monday",
      "Tueday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    this._dayIndex = this._dateInstance.getDay();
  }
  getTimeOfTheDay() {
    //Morning is from sunrise to 11:59 AM. Sunrise typically occurs around 6 AM.
    //Noon is at 12:00 PM.
    //Afternoon is from 12:01 PM to around 6:00 PM.
    //Evening is from 6:01 PM to 9 PM, or around sunset.
    //Night is from sunset to sunrise, so from 9:01 PM until 5:59 AM.

    const hourMin = parseInt(
      this._dateInstance.getHours().toString() +
        this._dateInstance.getMinutes().toString()
    );

    //
    if (hourMin >= 0 && hourMin <= 659) return "eve";
    else if (hourMin >= 700 && hourMin <= 1159) return "morn";
    else if (hourMin >= 1200 && hourMin <= 1659) return "day";
    else if (hourMin >= 1700 && 2359) return "night";
  }

  getDayToday() {
    return this._dayArr[this._dayIndex];
  }

  getNextDay() {
    if (this._dayIndex === 6) this._dayIndex = 0;
    else this._dayIndex++;

    return this._dayArr[this._dayIndex];
  }
}

// class Giphy {
//   constructor() {
//     this._apiKey = QbzkK6pGGcAEfeFjhO6h3XhJFFFh18Hm;
//   }

// }
class WeatherDisplay {
  constructor(weatherData) {
    this.weatherData = weatherData;
    this.timeInstance = new TimeMethods();
  }
  //NOTE: cant do showLeftPart because of laptop lagging
  showLeftPart() {}

  showRightPart() {
    //feels like
    // humidity
    //chance of rain
    // wind speed
    const feelsLikeDisplay = document.querySelector("#feels-like-info");
    feelsLikeDisplay.innerHTML =
      this.weatherData[0].feelsLike[
        this.timeInstance.getTimeOfTheDay()
      ].toFixed(2) + "\xB0";

    const humidityDisplay = document.querySelector("#humidity-info");
    humidityDisplay.innerHTML = this.weatherData[0].humidity + "%";

    const windSpeedDisplay = document.querySelector("#wind-speed-info");
    windSpeedDisplay.innerHTML = this.weatherData[0].windSpeed + " km/hr";
  }

  showCards() {
    // day
    // actual temp
    // feels like
    // logo

    //TODO: delete createElement, hard code it in index.html, and just input values to innerHTML
    for (let i = 1; i < this.weatherData.length; i++) {
      const tod = this.timeInstance.getTimeOfTheDay();

      const display = document.getElementById("card-" + i);

      const dayDisplay = document.createElement("p");
      dayDisplay.innerHTML = this.timeInstance.getNextDay();

      const tempDisplay = document.createElement("p");
      tempDisplay.innerHTML = this.weatherData[i].temp[tod].toFixed(2) + "\xB0";
      tempDisplay.style.fontSize = "2em";

      // const feelsLikeDisplay = document.createElement("p");
      // feelsLikeDisplay.innerHTML = this.weatherData[i].feelsLike[tod];
      // feelsLikeDisplay.style.fontSize = "1.25em";

      const logo = document.createElement("img");

      console.log(this.weatherData[i].weather.icon);

      logo.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${this.weatherData[i].weather[0].icon}.png`
      );

      display.append(dayDisplay);
      display.append(tempDisplay);
      display.append(logo);
    }
  }
}

(async function main() {
  const latlong = new ConvertLocToGeoCoor("Manila");
  const geoData = await latlong.getCoordinates();
  const weatherData = new Weather(geoData);

  const weatherDisplay = new WeatherDisplay(
    await weatherData.getWeatherForecast()
  );
  weatherDisplay.showCards();
  weatherDisplay.showRightPart();
})();
