function updateClock() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return hour;
}

let clock = updateClock();
setInterval(updateClock, 1000);

const LatLon = async () => {
    return new Promise(async (resolve, reject) => {
        await window.navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error("Error 404 NOT FOUND"));
            }
        );
    });
};

let currentLocation = async () => {
    try {
        let geo = await LatLon();
        let latitude = geo.lat;
        let longitude = geo.lon;
        let LatLonApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid={Enter Your API Key}&units=metric`);
        let resp = await LatLonApi.json();
        let CityName = resp.name;
        let Main_temperature = Math.ceil(resp.main.temp);
        let feels_like = Math.ceil(resp.main.feels_like);
        let Weather = resp.weather[0].main;
        let Description = resp.weather[0].description;
        let arr = [CityName, Main_temperature, feels_like, Weather, Description];
        WeatherImg(arr);
        return arr;
    } catch (error) {
        console.log(new Error("Server under maintenance"));
    }
};

async function WeatherImg(Images) {
    if (Images[3] == "Rain") {
        document.getElementById("weather-img").src = "../images/rain.png";
        document.getElementById("weather-video").src = "../images/Rain-GIF.gif";
    } else if (Images[3] == "Clouds" && (24 > clock > 18 || 0 < clock < 6)) {
        document.getElementById("weather-img").src = "../images/cloudy-moon.png";
        document.getElementById("weather-video").src = "../images/cloudy-gif.gif";
    } else if (Images[3] == "Clouds" && (18 > clock > 6)) {
        document.getElementById("weather-img").src = "../images/cloudy-sun.png";
        document.getElementById("weather-video").src = "../images/cloudy-gif.gif";
    } else if (18 > clock > 6) {
        document.getElementById("weather-img").src = "../images/clear-sun.png";
        document.getElementById("weather-video").src = "../images/clear_sky-gif.gif";
    } else {
        document.getElementById("weather-img").src = "../images/clear-moon.png";
        document.getElementById("weather-video").src = "../images/night-giff.gif";
    }
}

let data = async () => {
    let dataDetail = await currentLocation();
    document.getElementById('detail-ele1').textContent = dataDetail[0]
    document.getElementById('temp').textContent = dataDetail[1]
    document.getElementById('feel_temp').textContent = dataDetail[2]
    document.getElementById('weath').textContent = dataDetail[3]
    document.getElementById('weath_desc').textContent = dataDetail[4]
}
data();

let SearchPlace = async () => {
    let RandomPlace = async () => {
        try {
            var PlaceName = await document.getElementById('cityNameInput').value;
            let PlaceToGeoApi = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${PlaceName}&count=10&language=en&format=json`);
            let PlaceToGeo = await PlaceToGeoApi.json();
            let latitude = PlaceToGeo.results[0].latitude
            let longitude = PlaceToGeo.results[0].longitude
            let LatLonApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid={Enter Your API Key}&units=metric`);
            let resp = await LatLonApi.json();
            let CityName = resp.name;
            let Main_temperature = Math.ceil(resp.main.temp);
            let feels_like = Math.ceil(resp.main.feels_like);
            let Weather = resp.weather[0].main;
            let Description = resp.weather[0].description;
            let arr = [CityName, Main_temperature, feels_like, Weather, Description];
            WeatherImg(arr);
            return arr;
        }
        catch (error) {
            console.log(new Error("Search Place Not Found"));
        }
    }

    let RandomData = async () => {
        try {
            let dataDetail = await RandomPlace();
            document.getElementById('detail-ele1').textContent = dataDetail[0]
            document.getElementById('temp').textContent = dataDetail[1]
            document.getElementById('feel_temp').textContent = dataDetail[2]
            document.getElementById('weath').textContent = dataDetail[3]
            document.getElementById('weath_desc').textContent = dataDetail[4]
        }
        catch (error) {
            console.log(new Error('Due To Search Place Not Found'))
        }
    }
    RandomData();
}

document.getElementById('search').addEventListener('click', SearchPlace);
