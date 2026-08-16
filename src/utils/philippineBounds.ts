export const PHILIPPINE_BOUNDS = {
  north: 21.5, south: 4.5, east: 127.0, west: 116.0
};

export const PAR_BOUNDS = {
  north: 25.0, south: 3.0, east: 135.0, west: 115.0
};

export function isInPhilippines(lat: number, lon: number): boolean {
  return lat >= PHILIPPINE_BOUNDS.south && lat <= PHILIPPINE_BOUNDS.north &&
         lon >= PHILIPPINE_BOUNDS.west && lon <= PHILIPPINE_BOUNDS.east;
}

export function isInPAR(lat: number, lon: number): boolean {
  return lat >= PAR_BOUNDS.south && lat <= PAR_BOUNDS.north &&
         lon >= PAR_BOUNDS.west && lon <= PAR_BOUNDS.east;
}