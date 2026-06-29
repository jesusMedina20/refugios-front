'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect, Suspense } from 'react';
import type { IRefugio } from '@/lib/types';
import { getAllRefugios } from '@/lib/api';
import { RefugioCard } from '@/components/RefugioCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const MapView = dynamic(
  () => import('@/components/MapView').then((m) => ({ default: m.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 sm:h-[500px]">
        Cargando mapa...
      </div>
    ),
  },
);

export function HomeClient() {
  const [refugios, setRefugios] = useState<IRefugio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [selectedRefugioId, setSelectedRefugioId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getAllRefugios();
        if (!cancelled) setRefugios(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar refugios');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const estados = useMemo(
    () => [...new Set(refugios.map((r) => r.ubicacion.estado))].sort(),
    [refugios],
  );

  const filtered = useMemo(() => {
    return refugios.filter((r) => {
      if (filterEstado && r.ubicacion.estado !== filterEstado) return false;
      if (filterTipo && r.tipo !== filterTipo) return false;
      return true;
    });
  }, [refugios, filterEstado, filterTipo]);

  if (loading) return <LoadingSpinner text="Cargando refugios..." />;
  if (error) return <ErrorMessage message={error} />;
  if (refugios.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="input w-auto"
          value={filterEstado}
          onChange={(e) => {
            setFilterEstado(e.target.value);
            setSelectedRefugioId(null);
          }}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {estados.map((est) => (
            <option key={est} value={est}>
              {est}
            </option>
          ))}
        </select>

        <select
          className="input w-auto"
          value={filterTipo}
          onChange={(e) => {
            setFilterTipo(e.target.value);
            setSelectedRefugioId(null);
          }}
          aria-label="Filtrar por tipo"
        >
          <option value="">Todos los tipos</option>
          <option value="refugio">Refugio</option>
          <option value="punto_resguardo">Punto de Resguardo</option>
          <option value="centro_acopio">Centro de Acopio</option>
        </select>

        <p className="self-center text-sm text-gray-500">
          {filtered.length} de {refugios.length} refugios
        </p>
      </div>

      {/* Grid + Map */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No hay refugios que coincidan con los filtros.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((r) => (
                <RefugioCard
                  key={r.id}
                  refugio={r}
                  onSelect={setSelectedRefugioId}
                  isSelected={r.id === selectedRefugioId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <Suspense fallback={<LoadingSpinner text="Cargando mapa..." />}>
            <MapView refugios={filtered} selectedId={selectedRefugioId ?? undefined} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
