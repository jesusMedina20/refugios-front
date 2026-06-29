export const API_BASE_URL = 'https://refugios-api.onrender.com';

export const SITE_NAME = 'Refugios para venezuela';
export const SITE_DESCRIPTION =
  'Directorio público de refugios sísmicos, puntos de resguardo y centros de acopio en Venezuela.';

export const TIPO_OPTIONS = [
  { value: 'refugio', label: 'Refugio' },
  { value: 'punto_resguardo', label: 'Punto de Resguardo' },
  { value: 'centro_acopio', label: 'Centro de Acopio' },
] as const;

export const FUENTE_OPTIONS = [
  { value: 'oficial', label: 'Oficial' },
  { value: 'sociedad_civil', label: 'Sociedad Civil' },
] as const;

export const MAP_CENTER: [number, number] = [10.0, -66.5];
export const MAP_ZOOM = 8;
