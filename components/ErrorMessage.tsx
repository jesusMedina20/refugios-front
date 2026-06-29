'use client';

type Props = {
  message: string;
  details?: string[];
  onRetry?: () => void;
};

export function ErrorMessage({ message, details, onRetry }: Props) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <svg
        className="mx-auto h-12 w-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Algo salió mal
      </h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>

      {details && details.length > 0 && (
        <ul className="mt-2 space-y-1">
          {details.map((d, i) => (
            <li key={i} className="text-xs text-red-600">
              {d}
            </li>
          ))}
        </ul>
      )}

      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6">
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
