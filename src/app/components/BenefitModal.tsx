"use client";
import { useEffect, useRef } from 'react';

interface BenefitModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  descriptionBlocks?: any[];
  // Medya listesi: {type: 'image'|'videoFile'|'videoUrl', url: string}[]
  media?: { type: string; url: string }[];
}

// YouTube URL'sini embed formatına çevir
function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// YouTube video ID'sini çıkar
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function BenefitModal({ open, onClose, title, descriptionBlocks, media }: BenefitModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Debug için medya verilerini konsola yazdır
  useEffect(() => {
    if (open && media) {
      console.log('Modal açıldı - Media verileri:', media);
    }
  }, [open, media]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={dialogRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <button aria-label="Kapat" onClick={onClose} className="absolute top-3 right-3 z-10 rounded-full bg-white/80 hover:bg-white shadow p-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-h-[90vh]">
          <div className="bg-black/5 overflow-y-auto p-3 max-h-[90vh]">
            <div className="space-y-4">
              {Array.isArray(media) && media.length > 0 ? (
                media.filter((m) => m && m.url).map((m, idx) => (
                  <div key={idx} className="w-full">
                    {m.type === 'image' && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={`${title} - ${idx+1}`} className="w-full h-auto rounded-lg max-h-[60vh] object-contain" />
                    )}
                    {m.type === 'videoFile' && (
                      <video key={`vf-${idx}`} controls className="w-full rounded-lg bg-black max-h-[60vh]">
                        <source src={m.url} />
                      </video>
                    )}
                    {m.type === 'videoUrl' && (
                      <>
                        {m.url.includes('youtube.com') || m.url.includes('youtu.be') ? (
                          <iframe 
                            key={`yt-${idx}`}
                            src={getYouTubeEmbedUrl(m.url)}
                            className="w-full aspect-video rounded-lg max-h-[60vh]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video key={`vu-${idx}`} controls className="w-full rounded-lg bg-black max-h-[60vh]">
                            <source src={m.url} />
                          </video>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-gray-400 min-h-[200px]">Medya eklenmedi</div>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            {Array.isArray(descriptionBlocks) && descriptionBlocks.length > 0 ? (
              <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                {/* descriptionBlocks PortableText dışında düz HTML blokları olabilir; burada basitçe string olarak işliyoruz */}
                {descriptionBlocks.map((blk: any, idx: number) => (
                  <p key={idx}>{typeof blk === 'string' ? blk : blk?.children?.map((c:any)=>c.text).join(' ')}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Açıklama bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


