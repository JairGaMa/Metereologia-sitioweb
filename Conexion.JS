//Proyecto de Clima en Sitio Web - Dragones.
class WeatherbitAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weatherbit.io/v2.0";
  }

  // Clima por coordenadas
  async getWeatherByCoords(lat, lon, lang = "es") {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error("Las coordenadas deben ser números válidos");
    }
    if (lat < -90 || lat > 90) {
      throw new Error("La latitud debe estar entre -90 y 90");
    }
    if (lon < -180 || lon > 180) {
      throw new Error("La longitud debe estar entre -180 y 180");
    }

    const url = `${this.baseUrl}/current?lat=${lat}&lon=${lon}&lang=${lang}&key=${this.apiKey}`;
    return this.fetchData(url);
  }

  // Obtener datos climáticos específicos por coordenadas
  async getWeatherDataByCoords(lat, lon, lang = "es") {
    try {
      const data = await this.getWeatherByCoords(lat, lon, lang);
      if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("No se encontraron datos meteorológicos para las coordenadas proporcionadas.");
      }

      const weather = data.data[0];
      return {
        temperatura: weather.temp,
        sensacion_termica: weather.app_temp,
        descripcion: weather.weather.description,
        humedad: weather.rh,
        presion: weather.pres,
        viento: weather.wind_spd,
        direccion_viento: weather.wind_cdir,
        indice_uv: weather.uv,
        nubosidad: weather.clouds,
        salida_sol: weather.sunrise,
        puesta_sol: weather.sunset
      };
    } catch (error) {
      throw new Error(`Error al obtener datos climáticos por coordenadas: ${error.message}`);
    }
  }

  // Método para realizar la solicitud a la API
  async fetchData(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("Respuesta de la API inválida o sin datos meteorológicos.");
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error("La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.");
      }
      throw new Error(`Error al obtener datos meteorológicos: ${error.message}`);
    }
  }
}

// Pruebas para la función getWeatherDataByCoords
(async () => {
  const apiKey = "4deb71f7508d4e23a10d807f9fa5ecfa";
  const weatherAPI = new WeatherbitAPI(apiKey);

  console.log("\n=== Pruebas para getWeatherDataByCoords ===");

  // Test 1: Coordenadas válidas
  console.log("\nTest 1: Coordenadas válidas (Ciudad de México)");
  try {
    const weatherDataCDMX = await weatherAPI.getWeatherDataByCoords(19.4326, -99.1332);
    console.log("Éxito: Datos obtenidos correctamente");
    console.log(weatherDataCDMX);
  } catch (error) {
    console.error("Fallo en Test 1:", error.message);
  }

  // Test 2: Coordenadas inválidas (latitud fuera de rango)
  console.log("\nTest 2: Coordenadas inválidas (latitud fuera de rango)");
  try {
    await weatherAPI.getWeatherDataByCoords(100, -99.1332);
    console.error("Fallo: Se esperaba un error por latitud inválida");
  } catch (error) {
    console.log("Éxito: Error manejado correctamente para latitud inválida");
  }

  // Test 3: Coordenadas inválidas (longitud fuera de rango)
  console.log("\nTest 3: Coordenadas inválidas (longitud fuera de rango)");
  try {
    await weatherAPI.getWeatherDataByCoords(19.4326, -200);
    console.error("Fallo: Se esperaba un error por longitud inválida");
  } catch (error) {
    console.log("Éxito: Error manejado correctamente para longitud inválida");
  }
})();