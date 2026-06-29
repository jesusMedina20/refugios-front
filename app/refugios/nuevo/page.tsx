import type { Metadata } from 'next';
import { RefugioForm } from '@/components/RefugioForm';

export const metadata: Metadata = {
  title: 'Agregar refugio',
  description: 'Registra un nuevo refugio sísmico en el directorio.',
};

export default function NuevoRefugioPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Agregar nuevo refugio
      </h1>
      <div className="card p-6 sm:p-8">
        <RefugioForm />
      </div>
    </div>
  );
}
