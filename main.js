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
    this.today = this.weatherData[0];
  }
  //NOTE: cant do showLeftPart because of laptop lagging
  showLeftPart() {
    console.log(this.today);
    const weatherLogo = document.querySelector("#weather-logo-today");
    weatherLogo.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${this.today.weather[0].icon}.png`
    );

    const weatherDescrip = document.querySelector("#weather-descrip-today");

    const fixStrings = this.today.weather[0].description.split(" ");
    let weatherDescription = "";

    for (let i = 0; i < fixStrings.length; i++) {
      const dString = fixStrings[i];
      // console.log(dString);
      weatherDescription +=
        dString[0].toUpperCase() + dString.slice(1, dString.length) + " ";
    }

    weatherDescrip.innerHTML = weatherDescription;

    const tod = this.timeInstance.getTimeOfTheDay();

    document.querySelector(".weather-temp").innerHTML =
      this.today.temp[tod].toFixed(2) + "\xB0" + "C";

    document.querySelector(".weather-date").innerHTML =
      new Date().toDateString();

    const timer = setInterval(() => {
      document.querySelector(".weather-time").innerHTML = new Date()
        .toTimeString()
        .split(" ")[0];
    }, 1000);
  }

  showRightPart() {
    //feels like
    // humidity
    //chance of rain
    // wind speed
    const feelsLikeDisplay = document.querySelector("#feels-like-info");
    feelsLikeDisplay.innerHTML =
      this.today.feelsLike[this.timeInstance.getTimeOfTheDay()].toFixed(2) +
      "\xB0" +
      "C"; //add degree symbol

    const humidityDisplay = document.querySelector("#humidity-info");
    humidityDisplay.innerHTML = this.today.humidity + "%";

    const windSpeedDisplay = document.querySelector("#wind-speed-info");
    windSpeedDisplay.innerHTML = this.today.windSpeed + " km/hr";
  }

  showCards() {
    // day
    // actual temp
    // feels like
    // logo

    //TODO: delete createElement, hard code it in index.html, and just input values to innerHTML
    for (let i = 1; i < this.weatherData.length; i++) {
      const tod = this.timeInstance.getTimeOfTheDay();

      const dayDisplay = document.querySelector("#card-" + [i] + "-day");

      dayDisplay.innerHTML = this.timeInstance.getNextDay();

      const tempDisplay = document.querySelector("#card-" + [i] + "-temp");
      tempDisplay.innerHTML =
        this.weatherData[i].temp[tod].toFixed(2) + "\xB0" + "C";
      tempDisplay.style.fontSize = "2em";

      const logo = document.querySelector("#card-" + [i] + "-logo");

      logo.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${this.weatherData[i].weather[0].icon}.png`
      );
    }
  }
}

function mainLogic() {
  const location =
    document.querySelector(".weather-search-bar").value || "Manila,Philippines";

  console.log(location);
  const latlong = new ConvertLocToGeoCoor(location);
  latlong.getCoordinates().then((loc) => {
    document.querySelector(".weather-place").innerHTML =
      loc.name + " " + loc.country;
    const weatherData = new Weather(loc);

    weatherData.getWeatherForecast().then((forecast) => {
      const weatherDisplay = new WeatherDisplay(forecast);
      weatherDisplay.showCards();
      weatherDisplay.showRightPart();
      weatherDisplay.showLeftPart();
    });
  });
}

(function main() {
  mainLogic();
  document.querySelector(".search-button").addEventListener("click", mainLogic);
})();
