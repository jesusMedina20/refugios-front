'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createRefugio, updateRefugio } from '@/lib/api';
import type { IRefugio, CreateRefugioData } from '@/lib/types';
import { TIPO_OPTIONS, FUENTE_OPTIONS } from '@/lib/constants';
import { ErrorMessage } from './ErrorMessage';

type Props = {
  refugio?: IRefugio;
};

type FormErrors = Partial<Record<keyof CreateRefugioData | 'general', string>>;

const ESTADOS_VE = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
  'Guárico', 'Lara', 'La Guaira', 'Mérida', 'Miranda', 'Monagas',
  'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
  'Vargas', 'Yaracuy', 'Zulia',
].sort();

function initFormData(refugio?: IRefugio): CreateRefugioData {
  return {
    nombre: refugio?.nombre ?? '',
    ubicacion: {
      estado: refugio?.ubicacion.estado ?? '',
      municipio: refugio?.ubicacion.municipio ?? '',
      parroquia: refugio?.ubicacion.parroquia ?? '',
      direccion: refugio?.ubicacion.direccion ?? '',
    },
    tipo: refugio?.tipo ?? null,
    capacidad: refugio?.capacidad ?? null,
    ocupacion_actual: refugio?.ocupacion_actual ?? null,
    servicios: refugio?.servicios ?? null,
    coordinador: refugio?.coordinador ?? null,
    contacto: refugio?.contacto ?? null,
    latitud: refugio?.latitud ?? null,
    longitud: refugio?.longitud ?? null,
    activo: refugio?.activo ?? true,
    fuente: refugio?.fuente ?? null,
  };
}

export function RefugioForm({ refugio }: Props) {
  const router = useRouter();
  const isEditing = !!refugio;
  const [data, setData] = useState<CreateRefugioData>(() => initFormData(refugio));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serviciosInput, setServiciosInput] = useState(
    refugio?.servicios?.join(', ') ?? '',
  );

  useEffect(() => {
    if (refugio) {
      setData(initFormData(refugio));
      setServiciosInput(refugio.servicios?.join(', ') ?? '');
    }
  }, [refugio]);

  function update<K extends keyof CreateRefugioData>(
    key: K,
    value: CreateRefugioData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function updateUbicacion(
    field: keyof CreateRefugioData['ubicacion'],
    value: string,
  ) {
    setData((prev) => ({
      ...prev,
      ubicacion: { ...prev.ubicacion, [field]: value },
    }));
    setErrors((prev) => ({ ...prev, general: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};

    if (!data.nombre || data.nombre.trim().length < 3) {
      errs.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!data.ubicacion.estado.trim()) errs.general = 'Complete todos los campos obligatorios';
    if (!data.ubicacion.municipio.trim()) errs.general = 'Complete todos los campos obligatorios';
    if (!data.ubicacion.parroquia.trim()) errs.general = 'Complete todos los campos obligatorios';
    if (!data.ubicacion.direccion.trim()) errs.general = 'Complete todos los campos obligatorios';

    if (data.latitud != null && (data.latitud < -90 || data.latitud > 90)) {
      errs.general = 'Latitud debe estar entre -90 y 90';
    }
    if (data.longitud != null && (data.longitud < -180 || data.longitud > 180)) {
      errs.general = 'Longitud debe estar entre -180 y 180';
    }
    if (data.contacto && !/^\+?[\d\s\-()]{7,15}$/.test(data.contacto)) {
      errs.general = 'Formato de contacto inválido';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    const payload: CreateRefugioData = {
      ...data,
      servicios:
        serviciosInput.trim() === ''
          ? null
          : serviciosInput.split(',').map((s) => s.trim()).filter(Boolean),
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
    };

    setSubmitting(true);

    try {
      if (isEditing && refugio) {
        await updateRefugio(refugio.id, payload);
      } else {
        await createRefugio(payload);
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al guardar el refugio';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitError && (
        <ErrorMessage message={submitError} />
      )}

      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="label">
          Nombre del refugio <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          className={`input ${errors.nombre ? 'border-red-400' : ''}`}
          value={data.nombre}
          onChange={(e) => update('nombre', e.target.value)}
          placeholder="Ej: Polideportivo José María Vargas"
          required
          minLength={3}
        />
        {errors.nombre && (
          <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Ubicación */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gray-900">
          Ubicación <span className="text-red-500">*</span>
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="estado" className="label">Estado</label>
            <select
              id="estado"
              className="input"
              value={data.ubicacion.estado}
              onChange={(e) => updateUbicacion('estado', e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {ESTADOS_VE.map((est) => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="municipio" className="label">Municipio</label>
            <input
              id="municipio"
              className="input"
              value={data.ubicacion.municipio}
              onChange={(e) => updateUbicacion('municipio', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="parroquia" className="label">Parroquia</label>
            <input
              id="parroquia"
              className="input"
              value={data.ubicacion.parroquia}
              onChange={(e) => updateUbicacion('parroquia', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="direccion" className="label">Dirección</label>
            <input
              id="direccion"
              className="input"
              value={data.ubicacion.direccion}
              onChange={(e) => updateUbicacion('direccion', e.target.value)}
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Tipo y Fuente */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tipo" className="label">Tipo</label>
          <select
            id="tipo"
            className="input"
            value={data.tipo ?? ''}
            onChange={(e) =>
              update('tipo', (e.target.value || null) as CreateRefugioData['tipo'])
            }
          >
            <option value="">Sin especificar</option>
            {TIPO_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fuente" className="label">Fuente</label>
          <select
            id="fuente"
            className="input"
            value={data.fuente ?? ''}
            onChange={(e) =>
              update('fuente', (e.target.value || null) as CreateRefugioData['fuente'])
            }
          >
            <option value="">Sin especificar</option>
            {FUENTE_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Capacidad y Ocupación */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="capacidad" className="label">Capacidad (personas)</label>
          <input
            id="capacidad"
            type="number"
            min={1}
            className="input"
            value={data.capacidad ?? ''}
            onChange={(e) =>
              update('capacidad', e.target.value ? Number(e.target.value) : null)
            }
            placeholder="Opcional"
          />
        </div>
        <div>
          <label htmlFor="ocupacion_actual" className="label">Ocupación actual</label>
          <input
            id="ocupacion_actual"
            type="number"
            min={0}
            className="input"
            value={data.ocupacion_actual ?? ''}
            onChange={(e) =>
              update(
                'ocupacion_actual',
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="Opcional"
          />
        </div>
      </div>

      {/* Coordinador y Contacto */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="coordinador" className="label">Coordinador</label>
          <input
            id="coordinador"
            className="input"
            value={data.coordinador ?? ''}
            onChange={(e) => update('coordinador', e.target.value || null)}
            placeholder="Opcional"
          />
        </div>
        <div>
          <label htmlFor="contacto" className="label">Contacto</label>
          <input
            id="contacto"
            className="input"
            value={data.contacto ?? ''}
            onChange={(e) => update('contacto', e.target.value || null)}
            placeholder="+58 XXX XXX XXXX"
          />
        </div>
      </div>

      {/* Coordenadas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="latitud" className="label">Latitud</label>
          <input
            id="latitud"
            type="number"
            step="any"
            className="input"
            value={data.latitud ?? ''}
            onChange={(e) =>
              update('latitud', e.target.value ? Number(e.target.value) : null)
            }
            placeholder="10.4806"
          />
        </div>
        <div>
          <label htmlFor="longitud" className="label">Longitud</label>
          <input
            id="longitud"
            type="number"
            step="any"
            className="input"
            value={data.longitud ?? ''}
            onChange={(e) =>
              update('longitud', e.target.value ? Number(e.target.value) : null)
            }
            placeholder="-66.9036"
          />
        </div>
      </div>

      {/* Servicios */}
      <div>
        <label htmlFor="servicios" className="label">
          Servicios (separados por coma)
        </label>
        <input
          id="servicios"
          className="input"
          value={serviciosInput}
          onChange={(e) => setServiciosInput(e.target.value)}
          placeholder="Agua, alimentos, atención médica..."
        />
      </div>

      {/* Activo */}
      <div className="flex items-center gap-3">
        <input
          id="activo"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          checked={data.activo === true}
          onChange={(e) => update('activo', e.target.checked)}
        />
        <label htmlFor="activo" className="text-sm text-gray-700">
          Refugio activo / disponible
        </label>
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar refugio'
              : 'Agregar refugio'}
        </button>
      </div>
    </form>
  );
}
