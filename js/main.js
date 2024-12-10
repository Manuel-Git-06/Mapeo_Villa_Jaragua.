// ======================== CONFIGURACIÓN INICIAL ========================

const VILLA_JARAGUA_COORDS = [18.49345, -71.48633];

const map = L.map('map', {
    center: VILLA_JARAGUA_COORDS,
    zoom: 7,
    minZoom: 5,
    maxZoom: 19
});

// Capas base
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

satelite.addTo(map);

L.control.layers({
    "Vista Satelital": satelite,
    "Vista Normal": osm
}).addTo(map);

// Categorías y colores
const CATEGORIAS = {
    infraestructura: { nombre: 'Infraestructura', color: '#f44336' },
    espaciosPublicos: { nombre: 'Espacios Públicos', color: '#4CAF50' },
    turismo: { nombre: 'Turismo', color: '#FFC107' },
    propiedadesPrivadas: { nombre: 'Propiedades Privadas', color: '#FF9800' },
    centrosEducativos: { nombre: 'Centros Educativos', color: '#9C27B0' }
};

const LUGARES = {
    infraestructura: [
        { nombre: "Ayuntamiento Municipal de Villa Jaragua", coords: [18.481043859831992, -71.48688950740198], descripcion: "Sede del gobierno municipal", imagen: "/imagenes/Ayuntamiento Municipal de Villa Jaragua.jpg" },
        { nombre: "DEPOSITO DE AGUA INAPA A.C ZONA ALTA", coords: [18.507670682964317, -71.4849004975306], descripcion: "Suministro de agua zona alta", imagen: "/imagenes/DEPOSITO DE AGUA INAPA A.C ZONA ALTA.jpg" },
        { nombre: "Estanque Artificial", coords: [18.494504, -71.520939], descripcion: "Estanque artificial de agua", imagen: "/imagenes/Estanque Artificial.jpg" },
        { nombre: "Estanque Artificial 2", coords: [18.500118, -71.462245], descripcion: "Otro estanque artificial", imagen: "/imagenes/Estanque Artificial2.jpg" },
        { nombre: "División Río Estero - Jaragua", coords: [18.508105962032587, -71.45368745817728], descripcion: "División territorial por río", imagen: "/imagenes/División Río Estero - Jaragua.jpg" }
    ],
    espaciosPublicos: [
        { nombre: "Parque Central Jaragua", coords: [18.490160195499403, -71.48680320052763], descripcion: "Parque principal", imagen: "/imagenes/Parque Central Jaragua.jpg" }
    ],
    turismo: [
        { nombre: "Cachón Mamey", coords: [18.48746948682149, -71.4870654853639], descripcion: "Punto de interés natural", imagen: "/imagenes/Cachón Mamey.jpg" },
        { nombre: "Túnel Ecológico de Villa Jaragua", coords: [18.48208699747505, -71.47008361203889], descripcion: "Área de interés ecológico", imagen: "/imagenes/Túnel Ecológico de Villa Jaragua.jpg" },
        { nombre: "La Pez, Zona de senderismo", coords: [18.468024967889374, -71.47782664225095], descripcion: "Zona natural (montañosa)", imagen: "/imagenes/La Pez, Zona de senderismo.jpg" },
        { nombre: "Lago Enriquillo", coords: [18.476296, -71.501601], descripcion: "El lago más grande de las Antillas", imagen: "/imagenes/Lago Enriquillo.jpg" },
        { nombre: "Bosques Secos y Matorrales", coords: [18.499907, -71.469045], descripcion: "Zona de bosque seco", imagen: "/imagenes/Bosques Secos y Matorrales.jpg" },
        { nombre: "La madre Villa Jaragua", coords: [18.49134630561627, -71.49904811381448], descripcion: "Municipio Madre Villa Jaragua", imagen: "/imagenes/mader_villa_jaragua.jpg" } 
    ],
    propiedadesPrivadas: [
        { nombre: "Finca del Licdo Segura", coords: [18.5197414242998, -71.44375491112503], descripcion: "Finca agrícola privada", imagen: "/imagenes/Finca del Licdo Segura.jpg" }
    ],
    centrosEducativos: [
        { nombre: "Colegio Marie Possepin - Fe y Alegría", coords: [18.4945856420669, -71.50069907281129], descripcion: "Centro educativo Fe y Alegría", imagen: "/imagenes/Colegio Marie Possepin - Fe y Alegría.png" },
        { nombre: "Escuela Básica Anacaona", coords: [18.492681367265035, -71.48974437548232], descripcion: "Escuela básica pública", imagen: "/imagenes/Escuela Básica Anacaona.jpg" },
        { nombre: "Escuela Básica Francisco A. Caamaño", coords: [18.498172946696343, -71.48431066766028], descripcion: "Otra escuela básica pública", imagen: "/imagenes/Escuela Básica Francisco A. Caamaño.jpg" }
    ]
};

const gruposMarcadores = {};
Object.keys(CATEGORIAS).forEach(categoria => {
    gruposMarcadores[categoria] = L.layerGroup();
});

const TIPOS_EMERGENCIA = {
    inundacion: { color: '#0000FF', icono: 'fa-water', descripcion: 'Ruta de evacuación para inundaciones' },
    incendio: { color: '#FF0000', icono: 'fa-fire', descripcion: 'Incendios en zonas secas' },
    terremoto: { color: '#FFA500', icono: 'fa-house-damage', descripcion: 'Alejarse de terrenos inestables (lago, montaña, infraestructura alta)' }
};

const RUTAS_EMERGENCIA = {
    rutas: [
        {
            nombre: "Ruta de Evacuación - Inundación Zona Sur",
            tipo: "inundacion",
            puntos: [
                [18.476296, -71.501601],
                [18.487469, -71.487065],
                [18.490160, -71.486803],
                [18.492681, -71.489744],
                [18.4945856420669, -71.50069907281129]
            ],
            descripcion: "Ruta desde el lago hacia la zona alta",
            tiempoEstimado: "25 minutos a pie"
        },
        {
            nombre: "Ruta de Evacuación - Inundación Zona Este",
            tipo: "inundacion",
            puntos: [
                [18.508105962032587, -71.45368745817728],
                [18.498172946696343, -71.48431066766028],
                [18.4945856420669, -71.50069907281129]
            ],
            descripcion: "Ruta desde el río hacia un punto seguro",
            tiempoEstimado: "20 minutos a pie"
        },
        {
            nombre: "Ruta de Evacuación - Incendio en Bosques Secos",
            tipo: "incendio",
            puntos: [
                [18.499907, -71.469045],
                [18.490160, -71.486803]
            ],
            descripcion: "Ruta desde zona seca hacia Parque Central",
            tiempoEstimado: "15 minutos a pie"
        },
        {
            nombre: "Ruta de Evacuación - Terremoto (Lago/Montaña)",
            tipo: "terremoto",
            puntos: [
                [18.476296, -71.501601],
                [18.468024967889374, -71.47782664225095],
                [18.490160, -71.486803]
            ],
            descripcion: "Alejarse del lago y montaña hacia el Parque Central",
            tiempoEstimado: "30 minutos a pie (aprox.)"
        }
    ],
    zonasRiesgo: [
        {
            nombre: "Lago Enriquillo",
            centro: [18.476296, -71.501601],
            radio: 1000,
            tipo: "inundacion"
        },
        {
            nombre: "Río Estero",
            centro: [18.508105962032587, -71.45368745817728],
            radio: 500,
            tipo: "inundacion"
        },
        {
            nombre: "Bosques Secos y Matorrales",
            centro: [18.499907, -71.469045],
            radio: 300,
            tipo: "incendio"
        },
        {
            nombre: "Zona cercanía del Lago Enriquillo (terreno inestable)",
            centro: [18.476296, -71.501601],
            radio: 500,
            tipo: "terremoto"
        },
        {
            nombre: "Zona montañosa (La Pez)",
            centro: [18.468024967889374, -71.47782664225095],
            radio: 500,
            tipo: "terremoto"
        },
        {
            nombre: "DEPOSITO DE AGUA INAPA A.C ZONA ALTA (terreno elevado e infraestructura)",
            centro: [18.507670682964317, -71.4849004975306],
            radio: 300,
            tipo: "terremoto"
        }
    ]
};

window.rutasActivas = [];
window.puntosSegurosActivos = [];
window.zonasRiesgoActivas = [];

function crearIcono(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<i class="fas fa-map-marker-alt" style="color: ${color}"></i>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

function animarCirculo(coords, categoria) {
    let radio = 0;
    const radioMaximo = 100;
    let circulo = null;

    const intervalo = setInterval(() => {
        if (circulo) {
            map.removeLayer(circulo);
        }

        circulo = L.circle(coords, {
            radius: radio,
            color: CATEGORIAS[categoria].color,
            fillColor: CATEGORIAS[categoria].color,
            fillOpacity: 0.2,
            weight: 2
        }).addTo(map);

        radio += 2;

        if (radio >= radioMaximo) {
            clearInterval(intervalo);
            setTimeout(() => {
                if (circulo) map.removeLayer(circulo);
            }, 2000);
        }
    }, 20);
}

let marcadorVillaJaragua;
let marcadoresAgregados = false;

function agregarMarcadores() {
    Object.entries(LUGARES).forEach(([categoria, lugares]) => {
        lugares.forEach(lugar => {
            const marker = L.marker(lugar.coords, { icon: crearIcono(CATEGORIAS[categoria].color) });

            const popupContent = `
                <div class="custom-popup">
                    ${lugar.imagen ? `<img src="${lugar.imagen}" alt="${lugar.nombre}" class="popup-image">` : ''}
                    <h3>${lugar.nombre}</h3>
                    <p>${lugar.descripcion}</p>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => animarCirculo(lugar.coords, categoria));
            gruposMarcadores[categoria].addLayer(marker);
        });
    });
}

function mostrarMarcadoresDetallados() {
    if (!marcadoresAgregados) {
        Object.values(gruposMarcadores).forEach(grupo => grupo.addTo(map));
        marcadoresAgregados = true;
    }
}

function crearLeyenda() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<h4>Leyenda</h4>';

        Object.entries(CATEGORIAS).forEach(([key, value]) => {
            div.innerHTML += `
                <div>
                    <i style="background: ${value.color}"></i>
                    ${value.nombre}
                </div>
            `;
        });

        return div;
    };
    legend.addTo(map);
}

function crearFiltros() {
    const filterDiv = document.querySelector('.filter-options');
    if (!filterDiv) return;

    Object.entries(CATEGORIAS).forEach(([key, value]) => {
        const label = document.createElement('label');
        label.className = 'filter-option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(gruposMarcadores[key]);
            } else {
                map.removeLayer(gruposMarcadores[key]);
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(value.nombre));
        filterDiv.appendChild(label);
    });
}

function limpiarMapaEmergencias() {
    if (window.rutasActivas) {
        window.rutasActivas.forEach(ruta => map.removeLayer(ruta));
        window.rutasActivas = [];
    }
    if (window.puntosSegurosActivos) {
        window.puntosSegurosActivos.forEach(punto => map.removeLayer(punto));
        window.puntosSegurosActivos = [];
    }
    if (window.zonasRiesgoActivas) {
        window.zonasRiesgoActivas.forEach(zona => map.removeLayer(zona));
        window.zonasRiesgoActivas = [];
    }
}

// Quitar la llamada a mostrarZonasRiesgo dentro de mostrarRutasEmergencia para que solo se muestren con el clic en emergencias
function mostrarRutasEmergencia(tipoEmergencia) {
    limpiarMapaEmergencias();

    const rutasDisponibles = RUTAS_EMERGENCIA.rutas.filter(ruta => ruta.tipo === tipoEmergencia);

    rutasDisponibles.forEach(ruta => {
        const rutaLinea = L.polyline(ruta.puntos, {
            color: TIPOS_EMERGENCIA[tipoEmergencia].color,
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10',
            className: 'ruta-emergencia'
        }).addTo(map);

        const decorator = (typeof L.polylineDecorator === 'function') ? L.polylineDecorator(rutaLinea, {
            patterns: [
                {
                    offset: '5%',
                    repeat: 50,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 15,
                        polygon: false,
                        pathOptions: {
                            color: TIPOS_EMERGENCIA[tipoEmergencia].color,
                            fillOpacity: 1,
                            weight: 2
                        }
                    })
                }
            ]
        }).addTo(map) : null;

        rutaLinea.bindPopup(`
            <div class="ruta-info">
                <h3>${ruta.nombre}</h3>
                <p>${ruta.descripcion}</p>
                <p><strong>Tiempo estimado:</strong> ${ruta.tiempoEstimado}</p>
            </div>
        `);

        window.rutasActivas.push(rutaLinea);
        if (decorator) window.rutasActivas.push(decorator);
    });
}

function mostrarZonasRiesgo(tipo) {
    RUTAS_EMERGENCIA.zonasRiesgo.forEach(zona => {
        if (zona.tipo === tipo) {
            const circuloRiesgo = L.circle(zona.centro, {
                radius: zona.radio,
                color: TIPOS_EMERGENCIA[tipo].color,
                fillColor: TIPOS_EMERGENCIA[tipo].color,
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(map);

            const etiqueta = L.divIcon({
                className: 'etiqueta-riesgo',
                html: `
                    <div style="background: white; padding: 5px; border-radius: 3px;">
                        <strong>Zona de Riesgo</strong><br>
                        ${zona.nombre}
                    </div>
                `
            });

            L.marker(zona.centro, { icon: etiqueta }).addTo(map);
            window.zonasRiesgoActivas.push(circuloRiesgo);

            // Animar parpadeo para incendio y terremoto
            if (tipo === 'incendio' || tipo === 'terremoto') {
                circuloRiesgo._path.classList.add('ruta-emergencia');
            }
        }
    });
}

function crearPanelEmergencias() {
    const panel = document.createElement('div');
    panel.className = 'panel-emergencias';
    panel.innerHTML = `
        <h3><i class="fas fa-exclamation-triangle"></i> Rutas de Emergencia</h3>
        <div class="contenido-emergencias">
            ${Object.entries(TIPOS_EMERGENCIA).map(([tipo, config]) => `
                <button class="boton-emergencia" data-tipo="${tipo}" style="background: ${config.color}; color: white;">
                    <i class="fas ${config.icono}"></i> ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </button>
            `).join('')}
            <button class="boton-emergencia" data-tipo="limpiar" style="background: #9e9e9e; color: white;">
                <i class="fas fa-times"></i> Limpiar Mapa
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    panel.querySelectorAll('.boton-emergencia').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tipo = e.target.closest('.boton-emergencia').dataset.tipo;
            if (tipo === 'limpiar') {
                limpiarMapaEmergencias();
            } else {
                // Primero mostrar rutas de emergencia
                mostrarRutasEmergencia(tipo);
                // Luego mostrar zonas de riesgo
                mostrarZonasRiesgo(tipo);
            }
        });
    });
}

function mostrarMarcadorPrincipal() {
    const iconoPrincipal = L.divIcon({
        className: 'custom-marker',
        html: `<i class="fas fa-map-marker-alt" style="color: blue;"></i>`,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
    });

    const marcadorVillaJaragua = L.marker(VILLA_JARAGUA_COORDS, { icon: iconoPrincipal }).addTo(map);
    marcadorVillaJaragua.bindPopup("<b>Villa Jaragua</b><br>Comunidad Central").openPopup();
}

map.on('zoomend', () => {
    if (map.getZoom() >= 12 && !marcadoresAgregados) {
        mostrarMarcadoresDetallados();
    }
});



function mostrarZonasRiesgo(tipo) {
    RUTAS_EMERGENCIA.zonasRiesgo.forEach(zona => {
        if (zona.tipo === tipo) {
            const circuloRiesgo = L.circle(zona.centro, {
                radius: zona.radio,
                color: TIPOS_EMERGENCIA[tipo].color,
                fillColor: TIPOS_EMERGENCIA[tipo].color,
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(map);

            const etiqueta = L.divIcon({
                className: 'etiqueta-riesgo',
                html: `
                    <div style="background: white; padding: 5px; border-radius: 3px;">
                        <strong>Zona de Riesgo</strong><br>
                        ${zona.nombre}
                    </div>
                `
            });

            const marcadorEtiqueta = L.marker(zona.centro, { icon: etiqueta }).addTo(map);

            window.zonasRiesgoActivas.push(circuloRiesgo);
            window.zonasRiesgoActivas.push(marcadorEtiqueta); // Añadimos también el marcador de la etiqueta

            // Animar parpadeo para incendio y terremoto
            if (tipo === 'incendio' || tipo === 'terremoto') {
                circuloRiesgo._path.classList.add('ruta-emergencia');
            }
        }
    });
}





function mostrarZonasRiesgo(tipo) {
    RUTAS_EMERGENCIA.zonasRiesgo.forEach(zona => {
        if (zona.tipo === tipo) {
            const circuloRiesgo = L.circle(zona.centro, {
                radius: zona.radio,
                color: TIPOS_EMERGENCIA[tipo].color,
                fillColor: TIPOS_EMERGENCIA[tipo].color,
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(map);

            // Estilos mejorados para la etiqueta
            const etiqueta = L.divIcon({
                className: 'etiqueta-riesgo',
                html: `
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 10px 15px;
                        border-radius: 6px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        font-size: 0.9rem;
                        line-height: 1.4;
                        color: #333;
                        max-width: 200px;
                    ">
                        <h4 style="
                            margin: 0 0 5px 0;
                            font-size: 1rem;
                            font-weight: bold;
                            color: ${TIPOS_EMERGENCIA[tipo].color};
                            border-bottom: 2px solid ${TIPOS_EMERGENCIA[tipo].color};
                            padding-bottom: 3px;
                        ">Zona de Riesgo</h4>
                        <p style="
                            margin: 0;
                            font-size: 0.9rem;
                        ">${zona.nombre}</p>
                    </div>
                `
            });

            const marcadorEtiqueta = L.marker(zona.centro, { icon: etiqueta }).addTo(map);
            window.zonasRiesgoActivas.push(circuloRiesgo);
            window.zonasRiesgoActivas.push(marcadorEtiqueta);

            if (tipo === 'incendio' || tipo === 'terremoto') {
                circuloRiesgo._path.classList.add('ruta-emergencia');
            }
        }
    });
}





function limpiarMapaEmergencias() {
    if (window.rutasActivas) {
        window.rutasActivas.forEach(layer => map.removeLayer(layer));
        window.rutasActivas = [];
    }
    if (window.puntosSegurosActivos) {
        window.puntosSegurosActivos.forEach(layer => map.removeLayer(layer));
        window.puntosSegurosActivos = [];
    }
    if (window.zonasRiesgoActivas) {
        window.zonasRiesgoActivas.forEach(layer => map.removeLayer(layer));
        window.zonasRiesgoActivas = [];
    }
}




// ======================== INICIALIZACIÓN TOTAL ========================
function inicializar() {
    agregarMarcadores();
    crearLeyenda();
    crearFiltros();
    crearPanelEmergencias();
    mostrarMarcadorPrincipal();
}

inicializar();
