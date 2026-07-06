'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Sayfayı belirli aralıklarla arka planda yeniler (yeni bir sekme
 * açmadan / kaydırma konumunu bozmadan). Ops panelinin "canlı" hissini
 * korumak için kullanılır.
 */
export default function AutoRefresh({ intervalMs = 30000 }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
