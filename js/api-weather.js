import {
    WEATHER_API_KEY,
    MAPS_API_KEY
} from "./api-keys.js";


window.addEventListener('load', () => {

    let estado = document.getElementById('clima');
    let map = document.getElementById('maps');
    let ciudadNombre = document.getElementById('ciudad');
    let respuesta = document.getElementById('respuesta');
    let btn = document.getElementById('btn');
    let input = document.getElementsByTagName('input');
    /* const apiKey = '48599f7b1dbfd1805d0bd853d791da40'; */
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    /* const apiKeyMaps = 'AIzaSyBObHbJM9NjSAPd-nnv_4owBcue6KlBBNo'; */
    const urlMaps = 'https://www.google.com/maps/embed/v1/view?key=';

    if (localStorage.getItem('Ciudad')) {
        let recuperar = JSON.parse(localStorage.getItem('Ciudad'));
        dibujarRes(recuperar);
        dibujarMapa(recuperar);
    }

    input[0].addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            btn.click();
        }
        event.preventDefault();
    })

    btn.addEventListener('click', () => {
        let ciudad = palabra();

        console.log(ciudad);
        const fetchPromise = fetch(`${url}?q=${ciudad}&units=metric&lang=es&appid=${WEATHER_API_KEY}`);

        fetchPromise.then(response => {
            if (response.status != 200) {
                respuesta.innerHTML = 'No se encontró la Ciudad ingresada';
                map.innerHTML = '';
                ciudadNombre.innerHTML = '&#x1f614';
                estado.innerHTML = '';
                console.log('Parece que hubo un error ' + response.status);
                return;
            } else {
                console.log('Response: ' + response);
                /* response.json().then(data => console.log(data)); */
                return response.json();
            }
        }).then(result => {
            console.log('Result: ' + result);
            if (result !== undefined) {
                localStorage.setItem('Ciudad', JSON.stringify(result));
                dibujarRes(result);
                dibujarMapa(result);
            }
        }).catch(err => console.log('Hubo un error: ', err));
    })

    function palabra() {
        let palabra = document.getElementById('palabra');
        return palabra.value;
    }

    function dibujarRes(data) {
        console.log(data);

        let grados = convertGrados(data.main);
        let clima = iconoClimaFondo(data.weather[0].main);

        estado.innerHTML = traducirClima(`${data.weather[0].main}`);
        ciudadNombre.innerHTML = data.name;
        respuesta.innerHTML = `<span>${clima} ${grados.temp}</span><ul>
        <li>Sensación térmica: ${grados.feels_like}</li>
        <li>Máxima: ${grados.temp_max}</li>
        <li>Mínima: ${grados.temp_min}</li></ul>
        <ul><li>Humedad: ${grados.humidity}%</li>
        <li>Presión: ${grados.pressure} hPa</li>
        <li>Vientos: ${data.wind.speed} km/h</li></ul>`;
    }

    function convertGrados(grados) {
        for (let key in grados) {
            if (key != 'pressure' && key != 'humidity') {
                grados[key] = parseInt(grados[key]) + '°';
            }
        }
        return grados;
    }

    function iconoClimaFondo(clima) {
        if (clima.toUpperCase().includes('CLEAR')) {
            colorFondo('soleado');
            return `<i class="fas fa-sun"></i>`;
        } else if (clima.toUpperCase().includes('RAIN')) {
            colorFondo('lluvioso');
            return `<i class="fas fa-cloud-showers-heavy"></i>`;
        } else {
            colorFondo('nublado');
            return `<i class="fas fa-cloud"></i>`;
        }
    }

    function colorFondo(color) {
        let fondo = document.getElementsByTagName('body');
        fondo[0].setAttribute('class', color);
    }

    function dibujarMapa(datos) {
        console.log(datos.coord.lat)
        map.innerHTML = `<iframe
        width="100%"
        height="100%"
        frameborder="0" style="border:0"
        src="${urlMaps}${MAPS_API_KEY}&center=${datos.coord.lat},${datos.coord.lon}&zoom=10" allowfullscreen>
      </iframe>`;
    }

    function traducirClima(clima) {
        if (clima.toUpperCase().includes('CLEAR')) {
            return `Despejado`;
        } else if (clima.toUpperCase().includes('RAIN')) {
            return `Lluvioso`;
        } else {
            return `Nublado`;
        }
    }
})