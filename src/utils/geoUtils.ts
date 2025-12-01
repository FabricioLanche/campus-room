// Base de datos de coordenadas con etiquetas
export const KNOWN_LOCATIONS: Record<string, { lat: number; lng: number; label: string }> = {
  // Universidades
  'utec': { lat: -12.1354, lng: -77.0225, label: "UNIVERSIDAD" },
  'universidad de lima': { lat: -12.0850, lng: -76.9708, label: "UNIVERSIDAD" },
  'pucp': { lat: -12.0706, lng: -77.0805, label: "UNIVERSIDAD" },
  'upc': { lat: -12.1041, lng: -76.9629, label: "UNIVERSIDAD" },
  'pacifico': { lat: -12.0863, lng: -77.0526, label: "UNIVERSIDAD" },
  
  // Distritos
  'barranco': { lat: -12.1416, lng: -77.0195, label: "DISTRITO" },
  'miraflores': { lat: -12.1111, lng: -77.0316, label: "DISTRITO" },
  'san isidro': { lat: -12.0983, lng: -77.0352, label: "DISTRITO" },
  'surco': { lat: -12.1333, lng: -76.9856, label: "DISTRITO" },
  'lince': { lat: -12.0864, lng: -77.0358, label: "DISTRITO" },
  'jesus maria': { lat: -12.0782, lng: -77.0476, label: "DISTRITO" }, // <--- AQUÍ ESTÁ
  'magdalena': { lat: -12.0927, lng: -77.0690, label: "DISTRITO" },
  'pueblo libre': { lat: -12.0769, lng: -77.0644, label: "DISTRITO" },
  'san borja': { lat: -12.1070, lng: -76.9996, label: "DISTRITO" },
  'san miguel': { lat: -12.0837, lng: -77.0890, label: "DISTRITO" },
  'surquillo': { lat: -12.1126, lng: -77.0123, label: "DISTRITO" }
};

// Función para calcular distancia (se mantiene igual)
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};