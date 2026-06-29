'use client';

import { ErrorMessage } from '@/components/ErrorMessage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ErrorMessage message={error.message} onRetry={reset} />
    </div>
  );
}
