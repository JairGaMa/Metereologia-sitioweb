// Coordenadas de las ciudades de Tamaulipas
const coordenadasCiudades = {
    "Abasolo": { lat: 24.0722, lon: -98.3850 },
    "Aldama": { lat: 22.9192, lon: -98.0728 },
    "Altamira": { lat: 22.3933, lon: -97.9369 },
    "Antiguo Morelos": { lat: 22.5657013, lon: -99.0871372 },
    "Linares": { lat: 24.9258211, lon: -98.8581432 },
    "Bustamante": { lat: 26.5713326, lon: -100.5700509 },
    "Camargo": { lat: 26.3159794, lon: -98.8326371 },
    "Casas": { lat: 23.7264366, lon: -98.7370757 },
    "Ciudad Madero": { lat: 22.2761, lon: -97.8328 },
    "Ciudad Victoria": { lat: 23.7369, lon: -99.1411 },
    "Cruillas": { lat: 24.6528242, lon: -98.4938637 },
    "Ciudad Mante": { lat: 22.7422, lon: -98.9708 },
    "Gómez Farías": { lat: 23.03034858215632, lon: -99.14787360316107 },
    "González": { lat: 22.826985,  lon: -98.429916 },
    "Güémez": { lat: 23.91879573891437,  lon: -99.0049253476533 },
    "Guerrero": { lat: 26.77100556270739,  lon: -99.44250381197406 },
    "Ciudad Díaz Ordaz": { lat: 26.2328, lon: -98.5919 },
    "Hidalgo": { lat: 24.244894791818496,  lon: -99.43688218661835 },
    "Jaumave": { lat: 23.4167, lon: -99.3833 },
    "Jiménez": { lat: 24.2372, lon: -98.4667 },
    "Llera": { lat: 23.3167, lon: -99.0167 },
    "Mainero": { lat: 24.561488,  lon: -99.612007 },
    "Matamoros": { lat: 25.8796, lon: -97.5042 },
    "Méndez": { lat: 25.117602, lon: -98.588423 },
    "Mier": { lat: 26.4333, lon: -99.1500 },
    "Miguel Alemán": { lat: 26.3986, lon: -99.0306 },
    "Miquihuana": { lat: 23.5833, lon: -99.7667 },
    "Nuevo Laredo": { lat: 27.4764, lon: -99.5161 },
    "Nuevo Morelos": { lat: 22.533805, lon: -99.218903 },

    "Padilla": { lat: 24.0500, lon: -98.9167 },
    
    "Reynosa": { lat: 26.0922, lon: -98.2772 },
    "Río Bravo": { lat: 25.9922, lon: -98.0931 },
    "San Carlos": { lat: 24.5667, lon: -98.9333 },
    "San Fernando": { lat: 24.8489, lon: -98.1547 },
    "San Nicolás": { lat: 24.3333, lon: -98.7667 },
    "Soto la Marina": { lat: 23.7667, lon: -98.2167 },
    "Tampico": { lat: 22.2331, lon: -97.8628 },
    "Tula": { lat: 23.0000, lon: -99.7167 },
    "Valle Hermoso": { lat: 25.6711, lon: -97.8133 },
    "Victoria": { lat: 23.7369, lon: -99.1411 },
    "Villagrán": { lat: 24.4667, lon: -99.4667 },
    "Xicoténcatl": { lat: 23.0000, lon: -98.8833 }
};

const API_KEY = '4deb71f7508d4e23a10d807f9fa5ecfa';

// Variables para elementos del DOM
let climaApi;
let btnBuscar;
let btnBorrar;
let inputCiudad;
let spinner;
let alertSection;
let climaInfo;
let mensajeError;

// Función para mostrar error
function mostrarError(mensaje) {
    if (alertSection && mensajeError) {
        alertSection.style.display = 'block';
        mensajeError.textContent = mensaje;
    }
}

// Función para mostrar advertencia (sin ocultar la información del clima)
function mostrarAdvertencia(mensaje) {
    if (alertSection && mensajeError) {
        alertSection.style.display = 'block';
        alertSection.style.backgroundColor = '#fff3cd';
        alertSection.style.borderColor = '#ffc107';
        alertSection.style.color = '#856404';
        mensajeError.textContent = mensaje;
    }
}

// Función para ocultar error/advertencia
function ocultarError() {
    if (alertSection) {
        alertSection.style.display = 'none';
        // Restaurar colores originales de error
        alertSection.style.backgroundColor = '';
        alertSection.style.borderColor = '';
        alertSection.style.color = '';
    }
}

// Función para mostrar spinner
function mostrarSpinner() {
    if (spinner && climaInfo) {
        spinner.style.display = 'block';
        climaInfo.style.display = 'none';
        ocultarError();
    }
}

// Función para ocultar spinner
function ocultarSpinner() {
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Función para actualizar la interfaz con los datos del clima
function actualizarInterfaz(datos) {
    const elementos = {
        ciudadNombre: document.getElementById('ciudadNombre'),
        temp: document.getElementById('temp'),
        sensacion: document.getElementById('sensacion'),
        descripcion: document.getElementById('descripcion'),
        humedad: document.getElementById('humedad'),
        presion: document.getElementById('presion'),
        vientoVel: document.getElementById('vientoVel'),
        vientoDir: document.getElementById('vientoDir'),
        uv: document.getElementById('uv'),
        nubosidad: document.getElementById('nubosidad'),
        amanecer: document.getElementById('amanecer'),
        atardecer: document.getElementById('atardecer')
    };

    // Verificar que todos los elementos existen
    const elementosFaltantes = Object.keys(elementos).filter(key => !elementos[key]);
    if (elementosFaltantes.length > 0) {
        console.error('Elementos faltantes:', elementosFaltantes);
        mostrarError('Error: Algunos elementos de la interfaz no se encontraron.');
        return;
    }

    elementos.ciudadNombre.textContent = datos.ciudad;
    elementos.temp.textContent = datos.temperatura + '°C';
    elementos.sensacion.textContent = datos.sensacion_termica;
    elementos.descripcion.textContent = datos.descripcion;
    elementos.humedad.textContent = datos.humedad;
    elementos.presion.textContent = datos.presion;
    elementos.vientoVel.textContent = datos.viento;
    elementos.vientoDir.textContent = datos.direccion_viento;
    elementos.uv.textContent = datos.indice_uv;
    elementos.nubosidad.textContent = datos.nubosidad;
    elementos.amanecer.textContent = datos.salida_sol;
    elementos.atardecer.textContent = datos.puesta_sol;
    
    if (climaInfo) {
        climaInfo.style.display = 'block';
    }

    // Verificar si la ciudad coincide
    if (!datos.esCiudadCorrecta) {
        mostrarAdvertencia(`⚠️ No se encontró información exacta para "${datos.ciudadSolicitada}". Se muestra información aproximada de "${datos.ciudad}".`);
    } else {
        ocultarError();
    }
}

// Función para buscar clima
async function buscarClima() {
    if (!inputCiudad) {
        console.error('Error: inputCiudad no está definido');
        return;
    }

    const ciudadSeleccionada = inputCiudad.value.trim();
    
    if (!ciudadSeleccionada) {
        mostrarError('Por favor, selecciona una ciudad.');
        return;
    }

    if (!coordenadasCiudades[ciudadSeleccionada]) {
        mostrarError('La ciudad seleccionada no está en nuestra lista.');
        return;
    }

    mostrarSpinner();

    try {
        const coords = coordenadasCiudades[ciudadSeleccionada];
        const datos = await climaApi.obtenerDatosClimaticosPorCoordenadas(
            coords.lat, 
            coords.lon, 
            "es",
            ciudadSeleccionada
        );
        ocultarSpinner();
        actualizarInterfaz(datos);
    } catch (error) {
        ocultarSpinner();
        mostrarError(`Error al obtener datos del clima: ${error.message}`);
    }
}

// Función para limpiar
function limpiarDatos() {
    if (inputCiudad) {
        inputCiudad.value = '';
    }
    if (climaInfo) {
        climaInfo.style.display = 'none';
    }
    ocultarError();
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    climaApi = new ClimaWeatherbit(API_KEY);
    
    btnBuscar = document.getElementById('btnBuscar');
    btnBorrar = document.getElementById('btnBorrar');
    inputCiudad = document.getElementById('ciudad');
    spinner = document.getElementById('spinner');
    alertSection = document.getElementById('alertSection');
    climaInfo = document.getElementById('climaInfo');
    mensajeError = document.getElementById('mensaje-error');

    if (!btnBuscar || !btnBorrar || !inputCiudad) {
        console.error('Error crítico: No se encontraron elementos esenciales del DOM');
        alert('Error: La página no se cargó correctamente. Por favor, recarga la página.');
        return;
    }

    btnBuscar.addEventListener('click', buscarClima);
    btnBorrar.addEventListener('click', limpiarDatos);

    inputCiudad.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarClima();
        }
    });

    console.log('App inicializada correctamente');
});