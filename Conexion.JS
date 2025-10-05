//Proyecto de Clima en Sitio Web - Dragones.
class WeatherbitAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weatherbit.io/v2.0";
  }

  // Clima por ciudad
  async getWeatherByCity(city, countryCode = "MX", lang = "es") {
    // Validación de parámetros
    if (!city || typeof city !== 'string') {
      throw new Error("El nombre de la ciudad es requerido y debe ser una cadena de texto");
    }
    
    if (countryCode && typeof countryCode !== 'string') {
      throw new Error("El código de país debe ser una cadena de texto");
    }

    const url = `${this.baseUrl}/current?city=${encodeURIComponent(city)}&country=${countryCode}&lang=${lang}&key=${this.apiKey}`;
    return this.fetchData(url);
  }

  // Clima por coordenadas
  async getWeatherByCoords(lat, lon, lang = "es") {
    // Validación de coordenadas
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

  // *** Nueva función para obtener datos climáticos específicos por coordenadas ***
  async getWeatherDataByCoords(lat, lon, lang = "es") {
    try {
      const data = await this.getWeatherByCoords(lat, lon, lang);
      
      // Validar que la respuesta tenga los datos esperados
      if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("No se encontraron datos meteorológicos para las coordenadas proporcionadas.");
      }

      const weather = data.data[0];
      
      // Retornar solo los datos solicitados en un objeto estructurado
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
      // Propagar el error con un mensaje claro
      throw new Error(`Error al obtener datos climáticos por coordenadas: ${error.message}`);
    }
  }

  // Control de errores mejorado
  async fetchData(url) {
    try {
      // Timeout para evitar esperas infinitas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Manejo específico de códigos de error HTTP
        if (response.status === 400) {
          throw new Error("Solicitud incorrecta. Verifica los parámetros.");
        } else if (response.status === 401) {
          throw new Error("API key inválida o no autorizada.");
        } else if (response.status === 404) {
          throw new Error("Ubicación no encontrada. Verifica el nombre de la ciudad o las coordenadas.");
        } else if (response.status === 429) {
          throw new Error("Límite de solicitudes excedido. Intenta más tarde.");
        } else if (response.status >= 500) {
          throw new Error("Error del servidor. Intenta más tarde.");
        } else {
          throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      // Validar que la respuesta tenga la estructura esperada
      if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("Respuesta de la API inválida o sin datos meteorológicos.");
      }
      
      return data;

    } catch (error) {
      // Manejo específico de diferentes tipos de errores
      if (error.name === 'AbortError') {
        throw new Error("La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.");
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Error de red. Verifica tu conexión a internet.");
      } else if (error.name === 'SyntaxError') {
        throw new Error("Error al procesar la respuesta del servidor.");
      } else {
        // Si ya es un error nuestro, lo propagamos
        if (error.message.startsWith("Ubicación no encontrada") || 
            error.message.startsWith("Error en la petición") ||
            error.message.startsWith("Solicitud incorrecta")) {
          throw error;
        }
        throw new Error(`Error al obtener datos meteorológicos: ${error.message}`);
      }
    }
  }
}

// Función para mostrar resultados de forma mas digerible/amigable
function displayWeather(data, locationType) {
  if (!data || !data.data || data.data.length === 0) {
    console.error("No hay datos meteorológicos disponibles.");
    return;
  }

  const weather = data.data[0];
  console.log(`=== Clima en ${weather.city_name}, ${weather.country_code} ===`);
  console.log(`Temperatura: ${weather.temp}°C`);
  console.log(`Sensación térmica: ${weather.app_temp}°C`);
  console.log(`Descripción: ${weather.weather.description}`);
  console.log(`Humedad: ${weather.rh}%`);
  console.log(`Presión: ${weather.pres} mb`);
  console.log(`Viento: ${weather.wind_spd} m/s, dirección ${weather.wind_cdir}`);
  console.log(`Visibilidad: ${weather.vis} km`);
  console.log(`Índice UV: ${weather.uv}`);
  console.log(`Nubosidad: ${weather.clouds}%`);
  console.log(`Salida del sol: ${weather.sunrise}`);
  console.log(`Puesta del sol: ${weather.sunset}`);
}

// *** Función para mostrar los datos climáticos específicos retornados por getWeatherDataByCoords ***
function displayWeatherDataByCoords(weatherData) {
  console.log(`=== Datos climáticos ===`);
  console.log(`Temperatura: ${weatherData.temperatura}°C`);
  console.log(`Sensación térmica: ${weatherData.sensacion_termica}°C`);
  console.log(`Descripción: ${weatherData.descripcion}`);
  console.log(`Humedad: ${weatherData.humedad}%`);
  console.log(`Presión: ${weatherData.presion} mb`);
  console.log(`Viento: ${weatherData.viento} m/s, dirección ${weatherData.direccion_viento}`);
  console.log(`Índice UV: ${weatherData.indice_uv}`);
  console.log(`Nubosidad: ${weatherData.nubosidad}%`);
  console.log(`Salida del sol: ${weatherData.salida_sol}`);
  console.log(`Puesta del sol: ${weatherData.puesta_sol}`);
}

// Función para manejar errores de forma amigable
function handleError(error, context = "") {
  const prefix = context ? `Error al obtener el clima ${context}:` : "Error:";
  console.error(`${prefix} ${error.message}`);
  
  // Mensajes específicos para el usuario
  if (error.message.includes("Ubicación no encontrada")) {
    console.error("Sugerencia: Verifica que el nombre de la ciudad esté escrito correctamente.");
  } else if (error.message.includes("API key inválida")) {
    console.error("Sugerencia: Verifica que tu API key sea válida y esté activa.");
  } else if (error.message.includes("Error de red")) {
    console.error("Sugerencia: Verifica tu conexión a internet e intenta nuevamente.");
  } else if (error.message.includes("Límite de solicitudes")) {
    console.error("Sugerencia: Has excedido el límite de solicitudes. Espera un momento antes de intentar nuevamente.");
  }
}

// Ejemplo de uso 
const apiKey = "4deb71f7508d4e23a10d807f9fa5ecfa";
const weatherAPI = new WeatherbitAPI(apiKey);

// ***Pruebas***
(async () => {
  try {
    console.log("=== Clima en Ciudad de México ===");
    const climaCDMX = await weatherAPI.getWeatherByCity("Mexico City");
    displayWeather(climaCDMX, "por ciudad");
    
    console.log("\n=== Clima en Mante (coordenadas) ===");
    const climaMerida = await weatherAPI.getWeatherByCoords(22.7421938, -98.9746578);
    displayWeather(climaMerida, "por coordenadas");
    
    console.log("\n=== Datos climáticos en Mante (nueva función por coordenadas) ===");
    const weatherDataMante = await weatherAPI.getWeatherDataByCoords(22.7421938, -98.9746578);
    displayWeatherDataByCoords(weatherDataMante);
    
    // *** Pruebas para la nueva función getWeatherDataByCoords ***
    console.log("\n=== Pruebas para getWeatherDataByCoords ===");
    
    // Test 1: Coordenadas válidas (Ciudad de México: 19.4326, -99.1332)
    console.log("\nTest 1: Coordenadas válidas (Ciudad de México)");
    try {
      const weatherDataCDMX = await weatherAPI.getWeatherDataByCoords(19.4326, -99.1332);
      console.log("Éxito: Datos obtenidos correctamente");
      displayWeatherDataByCoords(weatherDataCDMX);
      // Verificar que todos los campos esperados están presentes
      const expectedFields = [
        'temperatura', 'sensacion_termica', 'descripcion', 'humedad', 'presion',
        'viento', 'direccion_viento', 'indice_uv', 'nubosidad', 'salida_sol', 'puesta_sol'
      ];
      const missingFields = expectedFields.filter(field => !(field in weatherDataCDMX));
      if (missingFields.length === 0) {
        console.log("Éxito: Todos los campos esperados están presentes");
      } else {
        console.error(`Error: Faltan los campos: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      console.error("Fallo en Test 1:", error.message);
    }
    
    // Test 2: Coordenadas inválidas (latitud fuera de rango)
    console.log("\nTest 2: Coordenadas inválidas (latitud fuera de rango)");
    try {
      await weatherAPI.getWeatherDataByCoords(100, -99.1332);
      console.error("Fallo: Se esperaba un error por latitud inválida");
    } catch (error) {
      if (error.message.includes("La latitud debe estar entre -90 y 90")) {
        console.log("Éxito: Error manejado correctamente para latitud inválida");
      } else {
        console.error("Fallo en Test 2:", error.message);
      }
    }
    
    // Test 3: Coordenadas inválidas (longitud fuera de rango)
    console.log("\nTest 3: Coordenadas inválidas (longitud fuera de rango)");
    try {
      await weatherAPI.getWeatherDataByCoords(19.4326, -200);
      console.error("Fallo: Se esperaba un error por longitud inválida");
    } catch (error) {
      if (error.message.includes("La longitud debe estar entre -180 y 180")) {
        console.log("Éxito: Error manejado correctamente para longitud inválida");
      } else {
        console.error("Fallo en Test 3:", error.message);
      }
    }
    
  } catch (error) {
    handleError(error);
  }
})();

