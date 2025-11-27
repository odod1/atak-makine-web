'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

interface VideoModalProps {
  embedId: string;
  videoUrl: string;
  buttonLabel?: string;
  buttonClassName?: string;
}

export default function VideoModal({
  embedId,
  videoUrl,
  buttonLabel = 'Videoyu İzle',
  buttonClassName,
}: VideoModalProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current) setOpen(false);
    };
    overlayRef.current?.addEventListener('click', onClick);
    return () => overlayRef.current?.removeEventListener('click', onClick);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          buttonClassName ||
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/90 text-white hover:bg-red-600 transition shadow-sm hover:shadow-md'
        }
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 002.1-2.1c.3-1.9.5-3.9.5-5.8s-.2-3.9-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/></svg>
        {buttonLabel}
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-[92vw] max-w-2xl rounded-2xl bg-white shadow-2xl">
            <button
              aria-label="Kapat"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 z-[101] inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-md ring-1 ring-gray-200 hover:text-gray-800"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
                title={t('productVideo')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-sm text-gray-500">Videoyu yeni sekmede aç</span>
              <Link
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50"
              >
                YouTube’da aç
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


