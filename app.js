let api = 'https://api.darksky.net/forecast/f2bf07ab59a278d50ff4e098c9be65e6/';
let geoApi = 'https://api.opencagedata.com/geocode/v1/json?key=8f7aaedd48e94671a0ebc86a50c1a617&q=';
let proxy = 'https://cors-anywhere.herokuapp.com/';
let temperature = document.getElementById('temperature');
let summary = document.getElementById('description');
let name = document.getElementById('cityname');
let icon;
const city = () => {
  let cityName = document.getElementById('city').value;
  let countryName = document.getElementById('country').value;
  update();
  fetch(geoApi+cityName+','+countryName+'&no_annotations=1').then((e) => e.json()).then((data) => {
    let {lat,lng} = data.results[0].geometry;
    name.innerHTML = cityName.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    getWeather(lat,lng);
  });
}
const getTemperature = () => {
  if (navigator.geolocation) {
    update();
    navigator.geolocation.getCurrentPosition((e) => {
      let lat = e.coords.latitude;
      let lng =  e.coords.longitude;
      fetch(geoApi+lat+','+lng+'&no_annotations=1').then((e) => e.json()).then((data) => {
        cityName = data.results[0].components.city;
      });
      getWeather(lat,lng);
    });
  } else {
    temperature.innerHTML= "An Error has appeared, we can't access your position. Maybe consider allowing us the permition."
  }
}
const getWeather = (lat,lng) => {
  fetch(proxy+api+`${lat},${lng}`).then((e) => e.json()).then((data) => {
    temperature.innerHTML = toC(data.currently.temperature);
    summary.innerHTML = data.currently.summary;
    icon = data.currently.icon;
    name.innerHTML = cityName.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    setIcon(icon);
  })
}
const toC = (t) => {
  return `${Math.ceil((t - 32)/1.8)}°C` ;
}
const setIcon = (icon) => {
  const skycons = new Skycons({color:'white'});
  const currentIcon = icon.replace(/-/g,"_").toUpperCase();
  skycons.play();
  return skycons.set(document.getElementById('icon'),Skycons[currentIcon]);
}
const update = () => {
  document.getElementsByClassName('info')[0].classList.add('slider');
  document.getElementById('title').classList.add('disappear');
  document.getElementById('title').innerHTML = '';
  document.getElementsByClassName('holder')[0].classList.add('show');
}
