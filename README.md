# CampusRoom

CampusRoom es un frontend responsivo para una plataforma de alojamiento universitario. Está construido con **Vite + React + TailwindCSS**, usando una paleta moderna y componentes reutilizables listos para integrarse con APIs reales.

## Requisitos
- Node.js 18+
- npm 9+

## Cómo ejecutar el proyecto
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre el navegador en la URL indicada por Vite (por defecto http://localhost:5173).

## Características principales
- **Autenticación mock**: formularios de login y registro con validaciones básicas y manejo de sesión simulado vía contexto.
- **Publicación de avisos**: formulario para crear avisos con título, precio, dirección y descripción; los datos se almacenan en estado local.
- **Mapa interactivo**: placeholder estilizado que muestra puntos de ejemplo y está listo para reemplazarse por React Leaflet o Google Maps.
- **Listado de habitaciones**: tarjetas con imagen, ubicación, precio y CTA de detalles.
- **Navegación**: barra superior fija con rutas para Inicio, Avisos, Mapa y Login.

## Estructura
```
src/
├── assets/          # Recursos estáticos como el logo
├── components/      # Navbar, formularios, tarjetas y mapa
├── context/         # AuthContext con estado mock
├── data/            # Datos de ejemplo para avisos
├── pages/           # Páginas principales y vistas de mapa/listados
├── routes/          # Definición de rutas con React Router v6
├── types/           # Tipos compartidos
└── index.css        # Estilos base con Tailwind y fuente Inter
```

> Toda la interfaz está en español y la información se encuentra mockeada; no hay backend conectado.
