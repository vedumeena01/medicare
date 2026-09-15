'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('MediExplain Emergency ServiceWorker registered:', registration.scope);
          })
          .catch((error) => {
            console.warn('ServiceWorker registration skipped:', error);
          });
      });
    }
  }, []);

  return null;
}
