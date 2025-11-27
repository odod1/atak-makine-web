'use client'

import { useState } from 'react';

interface MachineGalleryButtonProps {
  hasGallery: boolean;
  galleryImages: { url: string; full?: string; thumb?: string; alt: string }[];
}

export default function MachineGalleryButton({ hasGallery, galleryImages }: MachineGalleryButtonProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isZoomTransition, setIsZoomTransition] = useState(false);

  if (!hasGallery || galleryImages.length === 0) return null;

  const handleGalleryClick = () => {
    setCurrentIndex(0);
    setLightboxOpen(true);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    
    // Eğer drag işlemi olduysa click'i ignore et
    if (isDragging) return;
    
    setIsZoomTransition(true);
    
    if (zoomLevel === 1) {
      // Normal boyuttan zoom'a geç (tek seviye)
      setZoomLevel(2.0);
    } else {
      // Zoom'dan normale dön
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
    
    // Transition'ı kısa süre sonra kapat
    setTimeout(() => {
      setIsZoomTransition(false);
    }, 200);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomLevel === 1) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX, 
      y: e.clientY 
    });
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging || zoomLevel === 1) return;
    
    e.preventDefault();
    
    // Mouse hareket miktarını hesapla
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    // Mevcut pozisyona ekle
    const newX = panPosition.x + deltaX;
    const newY = panPosition.y + deltaY;
    
    // Sınırları kontrol et
    const maxMove = 300; // Sabit sınır
    const clampedX = Math.max(-maxMove, Math.min(maxMove, newX));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, newY));
    
    setPanPosition({ x: clampedX, y: clampedY });
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') {
      if (zoomLevel > 1) {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      } else {
        setLightboxOpen(false);
      }
    }
  };

  const currentImage = galleryImages[currentIndex];

  return (
    <>
      <button
        onClick={handleGalleryClick}
        aria-label="Makine Fotoğraf Galerisi"
        title="Makine Fotoğraf Galerisi"
        className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Galeri</span>
      </button>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Previous Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            )}

            {/* Next Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <img
                src={currentImage.full || currentImage.url}
                alt={currentImage.alt}
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`max-w-full max-h-[90vh] object-contain transition-transform duration-200 select-none ${
                  zoomLevel === 1 
                    ? 'cursor-zoom-in' 
                    : isDragging
                      ? 'cursor-grabbing'
                      : 'cursor-grab'
                }`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                  transformOrigin: 'center center',
                  transition: isZoomTransition ? 'transform 0.2s ease' : 'none'
                }}
                draggable={false}
              />
            </div>

            {/* Image Counter & Zoom Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {galleryImages.length > 1 && (
                <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              )}
              <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                {zoomLevel === 1 
                  ? '🔍 Büyüt' 
                  : `${isDragging ? '🖱️ Sürükleniyor' : '✋ Sürükle'} • 🔍 Küçült`
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
