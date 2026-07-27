export const branches = [
  {
    id: 'branch-1',
    nombre: 'SUPER MARKET KOSHER – CARACAS 561',
    direccion: 'Caracas 561, Flores, Ciudad Autónoma de Buenos Aires',
    coordenadas: {
      lat: -34.6230248,
      lng: -58.4635242
    },
    isNew: true,
    googleMapsUrl: 'https://www.google.com/maps/place/Caracas+561,+C1406AZI+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6230471,-58.4637256,21z/data=!4m6!3m5!1s0x95bcc98a84fc2a0b:0x25ecf501dc395b59!8m2!3d-34.6230248!4d-58.4635242!16s%2Fg%2F11c26g23rc?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D',
    comoLlegarUrl: 'https://www.google.com/maps/dir/?api=1&destination=-34.6230248,-58.4635242'
  },
  {
    id: 'branch-2',
    nombre: 'SUPER MARKET KOSHER – ONCE (San Luis)',
    direccion: 'San Luis 2961, Once, Ciudad Autónoma de Buenos Aires',
    coordenadas: {
      lat: -34.5995477,
      lng: -58.4068469
    },
    googleMapsUrl: 'https://www.google.com/maps/place/Big+Sale/@-34.5995477,-58.4068469,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccb654076ea5d:0xb36107b65323d765!8m2!3d-34.5995477!4d-58.4068469!16s%2Fg%2F11g4kk_mwz?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D',
    comoLlegarUrl: 'https://www.google.com/maps/dir/?api=1&destination=-34.5995477,-58.4068469'
  },
  {
    id: 'branch-3',
    nombre: 'MEGA SUPER MARKET KOSHER – ECUADOR',
    direccion: 'Ecuador 673, Once, Ciudad Autónoma de Buenos Aires',
    coordenadas: {
      lat: -34.6021789,
      lng: -58.4069799
    },
    googleMapsUrl: 'https://www.google.com/maps/place/Mega+big+sale/@-34.6021789,-58.4069799,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccbea539a4be3:0x1083145a457b5b77!8m2!3d-34.6021789!4d-58.4069799!16s%2Fg%2F11j48zv6vn?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D',
    comoLlegarUrl: 'https://www.google.com/maps/dir/?api=1&destination=-34.6021789,-58.4069799'
  },
  {
    id: 'branch-4',
    nombre: 'SUPER MARKET KOSHER – BELGRANO',
    direccion: 'Moldes 2475, C1428 Cdad. Autónoma de Buenos Aires',
    coordenadas: {
      lat: -34.5601861,
      lng: -58.46233
    },
    googleMapsUrl: 'https://www.google.com/maps/place/Big+Sale/@-34.5601861,-58.46233,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb5004cc2cd05:0x1146bc6375d71e53!8m2!3d-34.5601861!4d-58.46233!16s%2Fg%2F11m6shwcpq?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D',
    comoLlegarUrl: 'https://www.google.com/maps/dir/?api=1&destination=-34.5601861,-58.46233'
  },
  {
    id: 'branch-5',
    nombre: 'SUPER MARKET KOSHER – PALERMO',
    direccion: 'Juan María Gutiérrez 3805, Palermo, Ciudad Autónoma de Buenos Aires',
    isKosher: true,
    coordenadas: {
      lat: -34.5806617,
      lng: -58.413788
    },
    googleMapsUrl: 'https://www.google.com/maps/place/Big+sale+kosher/@-34.5806617,-58.413788,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb5007bc0799d:0x707644b2a07c0af0!8m2!3d-34.5806617!4d-58.413788!16s%2Fg%2F11ycmr4z8z?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D',
    comoLlegarUrl: 'https://www.google.com/maps/dir/?api=1&destination=-34.5806617,-58.413788'
  }
];

/**
 * Checks if the Kosher branch is currently closed for Shabat.
 * Shabat closes on Fridays at 15:00 hs and remains closed all Saturday.
 * @returns {boolean} True if currently Shabat time
 */
export function isKosherClosedForShabat() {
  const now = new Date();
  const day = now.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
  const hour = now.getHours();

  // Friday after 15:00 hs (3 PM)
  if (day === 5 && hour >= 15) {
    return true;
  }
  // Saturday all day
  if (day === 6) {
    return true;
  }
  return false;
}
