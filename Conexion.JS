class WeatherbitAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weatherbit.io/v2.0";
  }
                                //METODOS
  // Clima por ciudad
  async getWeatherByCity(city, countryCode = "MX", lang = "es") {
    const url = `${this.baseUrl}/current?city=${city}&country=${countryCode}&lang=${lang}&key=${this.apiKey}`;
    return this.fetchData(url);
  }

  // Clima por coordenadas
  async getWeatherByCoords(lat, lon, lang = "es") {
    const url = `${this.baseUrl}/current?lat=${lat}&lon=${lon}&lang=${lang}&key=${this.apiKey}`;
    return this.fetchData(url);
  }

  // Control de errores basico
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos de Weatherbit:", error);
      return null;
    }
  }
}


const apiKey = "4deb71f7508d4e23a10d807f9fa5ecfa";      //clave de la api
const weatherAPI = new WeatherbitAPI(apiKey);

// pruebas de datos crudos
(async () => {
  console.log("=== Clima en Ciudad de México ===");
  const climaCDMX = await weatherAPI.getWeatherByCity("Mexico City");
  console.log(JSON.stringify(climaCDMX, null, 2));

  console.log("\n=== Clima en Mante (coordenadas) ===");
  const climaMerida = await weatherAPI.getWeatherByCoords(22.7421938, -98.9746578);
  console.log(JSON.stringify(climaMerida, null, 2));
})();

