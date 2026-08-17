'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
