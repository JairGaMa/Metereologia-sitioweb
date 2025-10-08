// Proyecto de Clima en Sitio Web - Dragones.
class ClimaWeatherbit {
  constructor(claveApi) {
    this.claveApi = claveApi;
    this.urlBase = "https://api.weatherbit.io/v2.0";
  }

  // Obtener clima por coordenadas
  async obtenerClimaPorCoordenadas(latitud, longitud, idioma = "es", unidades = "M") {
    if (typeof latitud !== 'number' || typeof longitud !== 'number') {
      throw new Error("Las coordenadas deben ser números válidos.");
    }
    if (latitud < -90 || latitud > 90) {
      throw new Error("La latitud debe estar entre -90 y 90.");
    }
    if (longitud < -180 || longitud > 180) {
      throw new Error("La longitud debe estar entre -180 y 180.");
    }

    const url = `${this.urlBase}/current?lat=${latitud}&lon=${longitud}&lang=${idioma}&units=${unidades}&key=${this.claveApi}`;
    return this.obtenerDatos(url);
  }

  // Obtener datos meteorológicos completos
  async obtenerDatosClimaticosPorCoordenadas(latitud, longitud, idioma = "es") {
    try {
      const datos = await this.obtenerClimaPorCoordenadas(latitud, longitud, idioma);
      if (!datos || !datos.data || !Array.isArray(datos.data) || datos.data.length === 0) {
        throw new Error("No se encontraron datos meteorológicos para las coordenadas proporcionadas.");
      }

      const clima = datos.data[0];
      const velocidadVientoKmh = (clima.wind_spd * 3.6).toFixed(1);

      // === Conversión de hora UTC a hora local de México ===
      const convertirAHoraLocalMexico = (horaUTC, fechaStr) => {
        const [anio, mes, dia] = fechaStr.split(" ")[0].split("-");
        const [hora, minuto] = horaUTC.split(":");
        const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia, hora, minuto));

        return new Intl.DateTimeFormat("es-MX", {
          timeZone: "America/Mexico_City",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(fechaUTC);
      };

      const salidaSol = convertirAHoraLocalMexico(clima.sunrise, clima.ob_time);
      const puestaSol = convertirAHoraLocalMexico(clima.sunset, clima.ob_time);

      return {
        ciudad: clima.city_name,
        temperatura: `${clima.temp.toFixed(1)} °C`,
        sensacion_termica: `${clima.app_temp.toFixed(1)} °C`,
        descripcion: clima.weather.description,
        humedad: `${clima.rh}%`,
        presion: `${clima.pres.toFixed(1)} hPa`,
        viento: `${velocidadVientoKmh} km/h`,
        direccion_viento: clima.wind_cdir_full,
        indice_uv: clima.uv,
        nubosidad: `${clima.clouds}%`,
        salida_sol: salidaSol,
        puesta_sol: puestaSol
      };
    } catch (error) {
      throw new Error(`Error al obtener datos climáticos por coordenadas: ${error.message}`);
    }
  }

  // === NUEVAS FUNCIONES SOLICITADAS ===

  // Obtener solo la temperatura
  async obtenerTemperatura(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.temperatura;
  }

  // Obtener solo la sensación térmica
  async obtenerSensacionTermica(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.sensacion_termica;
  }

  // Obtener solo la descripción del clima
  async obtenerDescripcion(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.descripcion;
  }

  //agregar las 3 funciones aqui
   // Obtener solo la nubosidad
  async obtenerNubosidad(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.nubosidad;
  }

  // Obtener solo la salida del sol
  async obtenerSalidaDelSol(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.salida_sol;
  }

  // Obtener solo la puesta del sol
  async obtenerPuestaDelSol(latitud, longitud) {
    const datos = await this.obtenerDatosClimaticosPorCoordenadas(latitud, longitud);
    return datos.puesta_sol;
  }




  // Realizar la solicitud a la API
  async obtenerDatos(url) {
    try {
      const controlador = new AbortController();
      const tiempoDeEspera = setTimeout(() => controlador.abort(), 10000);
      const respuesta = await fetch(url, { signal: controlador.signal });
      clearTimeout(tiempoDeEspera);

      if (!respuesta.ok) {
        throw new Error(`Error en la petición: ${respuesta.status} ${respuesta.statusText}`);
      }

      const datos = await respuesta.json();
      if (!datos || !datos.data || !Array.isArray(datos.data) || datos.data.length === 0) {
        throw new Error("Respuesta de la API inválida o sin datos meteorológicos.");
      }
      return datos;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error("La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.");
      }
      throw new Error(`Error al obtener datos meteorológicos: ${error.message}`);
    }
  }
}

// === PRUEBA RÁPIDA ===
(async () => {
  const apiKey = "4deb71f7508d4e23a10d807f9fa5ecfa";
  const climaAPI = new ClimaWeatherbit(apiKey);

  // Ciudad Mante, Tamaulipas
  const lat = 22.7411; 
  const lon = -98.9736;

  //solo una funcion que llama a la API y obtiene todos los datos, más eficiente y recomendable
  /*const datosClima = await climaAPI.obtenerDatosClimaticosPorCoordenadas(lat, lon);
  console.log("Temperatura:", datosClima.temperatura);
  console.log("Sensación térmica:", datosClima.sensacion_termica);
  console.log("Descripción:", datosClima.descripcion);*/

  //cada funcion hace una llamada a la API, no es eficiente pero es lo que se pidió
  console.log("Temperatura:", await climaAPI.obtenerTemperatura(lat, lon));
  console.log("Sensación térmica:", await climaAPI.obtenerSensacionTermica(lat, lon));
  console.log("Descripción:", await climaAPI.obtenerDescripcion(lat, lon));
  console.log("Nubosidad:", await climaAPI.obtenerNubosidad(lat, lon));
  console.log("Salida del sol:", await climaAPI.obtenerSalidaDelSol(lat, lon));
  console.log("Puesta del sol:", await climaAPI.obtenerPuestaDelSol(lat, lon));
})();