export interface IRefugio {
  id: string;
  nombre: string;
  ubicacion: {
    estado: string;
    municipio: string;
    parroquia: string;
    direccion: string;
  };
  tipo?: 'refugio' | 'punto_resguardo' | 'centro_acopio' | null;
  capacidad?: number | null;
  ocupacion_actual?: number | null;
  servicios?: string[] | null;
  coordinador?: string | null;
  contacto?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean | null;
  fuente?: 'oficial' | 'sociedad_civil' | null;
  created_at: string;
  updated_at: string;
}

export type CreateRefugioData = {
  nombre: string;
  ubicacion: {
    estado: string;
    municipio: string;
    parroquia: string;
    direccion: string;
  };
  tipo?: 'refugio' | 'punto_resguardo' | 'centro_acopio' | null;
  capacidad?: number | null;
  ocupacion_actual?: number | null;
  servicios?: string[] | null;
  coordinador?: string | null;
  contacto?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  fuente?: 'oficial' | 'sociedad_civil' | null;
};

export type UpdateRefugioData = Partial<CreateRefugioData>;

export type RefugioFilters = {
  estado?: string;
  tipo?: string;
  activo?: string;
};
