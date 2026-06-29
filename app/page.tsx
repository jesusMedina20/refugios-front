import type { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Refugios Sísmicos de Venezuela
        </h1>
        <p className="mt-2 text-gray-600">
          Directorio público de refugios, puntos de resguardo y centros de
          acopio ante eventos sísmicos.
        </p>
      </div>
      <HomeClient />
    </div>
  );
}
