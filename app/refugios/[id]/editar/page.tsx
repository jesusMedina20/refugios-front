import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getRefugioById } from '@/lib/api';
import { RefugioForm } from '@/components/RefugioForm';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const refugio = await getRefugioById(params.id);
    return {
      title: `Editar: ${refugio.nombre}`,
      description: `Modificar datos del refugio ${refugio.nombre}.`,
    };
  } catch {
    return { title: 'Refugio no encontrado' };
  }
}

export default async function EditarRefugioPage({ params }: Props) {
  let refugio;

  try {
    refugio = await getRefugioById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/refugios/${refugio.id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Volver al detalle
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Editar refugio
      </h1>
      <p className="mb-8 text-sm text-gray-600">{refugio.nombre}</p>

      <div className="card p-6 sm:p-8">
        <RefugioForm refugio={refugio} />
      </div>
    </div>
  );
}
