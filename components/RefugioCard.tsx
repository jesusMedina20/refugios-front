import Link from 'next/link';
import type { IRefugio } from '@/lib/types';

const tipoBadge: Record<string, string> = {
  refugio: 'bg-blue-100 text-blue-800',
  punto_resguardo: 'bg-amber-100 text-amber-800',
  centro_acopio: 'bg-green-100 text-green-800',
};

const tipoLabels: Record<string, string> = {
  refugio: 'Refugio',
  punto_resguardo: 'Punto de Resguardo',
  centro_acopio: 'Centro de Acopio',
};

type Props = {
  refugio: IRefugio;
  onSelect: (id: string) => void;
  isSelected?: boolean;
};

export function RefugioCard({ refugio, onSelect, isSelected }: Props) {
  return (
    <div
      className={`card cursor-pointer transition-shadow hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(refugio.id)}
    >
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Link
            href={`/refugios/${refugio.id}`}
            className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            {refugio.nombre}
          </Link>
          {refugio.activo === false && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Inactivo
            </span>
          )}
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {refugio.tipo && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tipoBadge[refugio.tipo] ?? 'bg-gray-100 text-gray-800'
              }`}
            >
              {tipoLabels[refugio.tipo] ?? refugio.tipo}
            </span>
          )}
          {refugio.fuente && (
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
              {refugio.fuente === 'oficial' ? 'Oficial' : 'Sociedad Civil'}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {refugio.ubicacion.direccion},{' '}
          {refugio.ubicacion.parroquia},{' '}
          {refugio.ubicacion.estado}
        </p>

        {refugio.capacidad != null && (
          <p className="mt-2 text-xs text-gray-500">
            Capacidad: {refugio.capacidad.toLocaleString()} personas
            {refugio.ocupacion_actual != null &&
              ` · Ocupación: ${refugio.ocupacion_actual}`}
          </p>
        )}
      </div>
    </div>
  );
}
