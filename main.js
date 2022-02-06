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
  constructor(location) {
    this.location = location;
  }

  getWeatherDataUsingLoc() {
    console.log(location);
    const apiKey = "48964d428f15677ab81748401048bf1c";
    let weatherData = {};

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?q=${this.location}&exclude=current,hourly,minutely,alerts&units=metric&appid=48964d428f15677ab81748401048bf1c`,
      {
        mode: "cors",
      }
    ).then((res) => {
      return res.json();
    });
  }
}

class WeatherDisplay {
  static;
}

async function main() {
  const latlong = new ConvertLocToGeoCoor("Manila");
  const wat = await latlong.getCoordinates();
  const we = new Weather("Manila");
}

main();
