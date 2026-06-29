import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getRefugioById } from '@/lib/api';

const tipoLabels: Record<string, string> = {
  refugio: 'Refugio',
  punto_resguardo: 'Punto de Resguardo',
  centro_acopio: 'Centro de Acopio',
};

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const refugio = await getRefugioById(params.id);
    return {
      title: refugio.nombre,
      description: `Refugio sísmico en ${refugio.ubicacion.estado} — ${refugio.ubicacion.direccion}`,
    };
  } catch {
    return { title: 'Refugio no encontrado' };
  }
}

export default async function RefugioDetailPage({ params }: Props) {
  let refugio;

  try {
    refugio = await getRefugioById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver al listado
      </Link>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {refugio.nombre}
              </h1>
              {refugio.tipo && (
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {tipoLabels[refugio.tipo] ?? refugio.tipo}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/refugios/${refugio.id}/editar`}
                className="btn-secondary text-sm"
              >
                Editar
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-100 p-6 sm:p-8">
          {/* Estado */}
          <SectionRow label="Estado">
            {refugio.activo === false ? (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                Inactivo
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Activo
              </span>
            )}
          </SectionRow>

          {/* Ubicación */}
          <SectionRow label="Ubicación">
            <p>{refugio.ubicacion.direccion}</p>
            <p className="text-gray-500">
              {refugio.ubicacion.parroquia}, {refugio.ubicacion.municipio},{' '}
              {refugio.ubicacion.estado}
            </p>
          </SectionRow>

          {/* Coordenadas */}
          {refugio.latitud != null && refugio.longitud != null && (
            <SectionRow label="Coordenadas">
              <p>
                {refugio.latitud}, {refugio.longitud}
              </p>
            </SectionRow>
          )}

          {/* Capacidad */}
          {refugio.capacidad != null && (
            <SectionRow label="Capacidad">
              <p>{refugio.capacidad.toLocaleString()} personas</p>
            </SectionRow>
          )}

          {/* Ocupación */}
          {refugio.ocupacion_actual != null && (
            <SectionRow label="Ocupación actual">
              <p>{refugio.ocupacion_actual} personas</p>
            </SectionRow>
          )}

          {/* Servicios */}
          {refugio.servicios && refugio.servicios.length > 0 && (
            <SectionRow label="Servicios">
              <div className="flex flex-wrap gap-2">
                {refugio.servicios.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SectionRow>
          )}

          {/* Coordinador */}
          {refugio.coordinador && (
            <SectionRow label="Coordinador">
              <p>{refugio.coordinador}</p>
            </SectionRow>
          )}

          {/* Contacto */}
          {refugio.contacto && (
            <SectionRow label="Contacto">
              <p>{refugio.contacto}</p>
            </SectionRow>
          )}

          {/* Fuente */}
          {refugio.fuente && (
            <SectionRow label="Fuente">
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                {refugio.fuente === 'oficial' ? 'Oficial' : 'Sociedad Civil'}
              </span>
            </SectionRow>
          )}

          {/* Timestamps */}
          <SectionRow label="Actualizado">
            <p className="text-sm text-gray-500">
              {new Date(refugio.updated_at).toLocaleDateString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </SectionRow>
        </div>
      </div>
    </div>
  );
}

function SectionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 sm:flex sm:gap-4">
      <dt className="text-sm font-medium text-gray-500 sm:w-36 sm:shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{children}</dd>
    </div>
  );
}
