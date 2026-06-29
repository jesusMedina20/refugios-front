import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Página no encontrada</h2>
      <p className="mt-2 text-gray-600">
        El refugio que buscas no existe o fue eliminado.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Volver al inicio
      </Link>
    </div>
  );
}
