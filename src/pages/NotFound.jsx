// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-aura-bg dark:bg-aura-dark-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="font-serif text-8xl text-aura-border dark:text-aura-dark-border mb-4">404</p>
        <h1 className="font-serif text-2xl text-aura-text dark:text-aura-dark-text mb-2">Oops.</h1>
        <p className="text-sm text-aura-muted dark:text-aura-dark-muted mb-8">
          This page isn't available. It may have moved or never existed.
        </p>
        <Link to="/" className="btn-primary gap-2">
          <ArrowLeft size={16} /> Back Home
        </Link>
      </div>
    </main>
  );
}
