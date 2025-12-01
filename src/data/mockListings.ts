import { Listing, Review } from '../types';

const getRandomOffset = (base: number) => base + (Math.random() - 0.5) * 0.015;

const districts = [
  { name: 'Barranco', lat: -12.1416, lng: -77.0195, priceBase: 900 },
  { name: 'Miraflores', lat: -12.1111, lng: -77.0316, priceBase: 1200 },
  { name: 'San Isidro', lat: -12.0983, lng: -77.0352, priceBase: 1400 },
  { name: 'Surco', lat: -12.1333, lng: -76.9856, priceBase: 800 },
];

const types = [
  { title: 'Habitación privada', specs: { bedrooms: 1, bathrooms: 1, area: 15 } },
  { title: 'Minidepa Estudiantil', specs: { bedrooms: 1, bathrooms: 1, area: 35 } },
  { title: 'Loft cerca a universidad', specs: { bedrooms: 1, bathrooms: 1, area: 40 } },
];

const images = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
];

// --- DATOS PARA RESEÑAS ---
const studentNames = ["Andrea P.", "Luis M.", "Sofia R.", "Jorge T.", "Valentina C.", "Mateo L.", "Camila S.", "Diego B."];
const positiveComments = [
  "Muy buena ubicación, llego caminando a la UTEC en 10 minutos.",
  "El señor Carlos es muy amable y atento con todo.",
  "Internet rápido, perfecto para las clases virtuales.",
  "La zona es súper tranquila y segura para caminar de noche.",
  "El departamento es tal cual las fotos, muy limpio.",
  "Buen precio para la zona, recomendado."
];
const neutralComments = [
  "Todo bien, aunque a veces se escucha un poco de ruido de la calle.",
  "El lugar es cómodo pero el wifi falló un par de veces.",
  "Es pequeño pero acogedor, ideal si solo vas a dormir y estudiar.",
  "La presión del agua podría ser mejor, pero aceptable."
];

// Función para generar reseñas aleatorias
const generateReviews = (count: number): Review[] => {
  return Array.from({ length: count }).map((_, i) => {
    const isPositive = Math.random() > 0.3; // 70% chance de comentario positivo
    const commentPool = isPositive ? positiveComments : neutralComments;
    const rating = isPositive ? Math.floor(Math.random() * 2) + 4 : 3; // 4-5 o 3
    
    return {
      id: `rev-${Math.random()}`,
      userName: studentNames[Math.floor(Math.random() * studentNames.length)],
      date: `${Math.floor(Math.random() * 6) + 1} meses atrás`,
      rating: rating,
      comment: commentPool[Math.floor(Math.random() * commentPool.length)]
    };
  });
};

export const mockListings: Listing[] = Array.from({ length: 50 }).map((_, i) => {
  const district = districts[Math.floor(Math.random() * districts.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const price = Math.ceil((district.priceBase + (Math.random() * 500)) / 10) * 10;
  const uniqueCode = `CTR-${1000 + i}`;

  return {
    id: i.toString(),
    title: `${type.title} en ${district.name}`,
    description: `Alojamiento ideal para estudiantes en ${district.name}. Incluye servicios básicos y wifi de alta velocidad.`,
    price: price,
    latitude: getRandomOffset(district.lat),
    longitude: getRandomOffset(district.lng),
    image: images[Math.floor(Math.random() * images.length)],
    address: `Av. Principal ${Math.floor(Math.random() * 900)}, ${district.name}`,
    specs: type.specs,
    landlordId: 'landlord-1',
    contractCode: uniqueCode,
    isUserCreated: false,
    
    // GENERAMOS 3 a 6 RESEÑAS POR AVISO
    reviews: generateReviews(Math.floor(Math.random() * 4) + 3)
  };
});