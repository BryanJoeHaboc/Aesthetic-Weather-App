class Weather {
  constructor(location) {
    const apiKey = "48964d428f15677ab81748401048bf1c";

    const latLong = fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${this.location}&limit=1&appid=${apiKey}`,
      { mode: "cors" }
    ).then((res) => {
      return res.json();
    });

    latLong.then((res) => console.log(res));

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

const we = new Weather("Manila");
we.getWeatherDataUsingLoc("Manila").then((res) => console.log(res));
