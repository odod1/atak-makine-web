'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '../hooks/useTranslation'

type GalleryImage = { url: string; alt: string; full?: string; thumb?: string }

interface ImageGalleryProps {
  images: GalleryImage[]
  aspectClass?: string // isteğe bağlı: ana görselin oranını dışarıdan belirle
  fit?: 'cover' | 'contain' // ana görsel object-fit
  sizesAttr?: string // next/image sizes override
  containerClassName?: string // ana kapsayıcı sınıf override
  showThumbs?: boolean
  showArrows?: boolean
  enableLightbox?: boolean
}

export default function ImageGallery({
  images,
  aspectClass,
  fit = 'cover',
  sizesAttr,
  containerClassName,
  showThumbs = true,
  showArrows = true,
  enableLightbox = true,
}: ImageGalleryProps) {
  const { t } = useTranslation()
  const sanitized = useMemo(() => (Array.isArray(images) ? images.filter(i => !!i?.url) : []), [images])
  const aspect = aspectClass || 'aspect-[4/3]'
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const lightboxTrackRef = useRef<HTMLDivElement | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState<{x:number;y:number}>({ x: 50, y: 50 })
  const [hoveringImage, setHoveringImage] = useState(false)
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const [lightboxMounted, setLightboxMounted] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  useEffect(() => {
    // Görsel değişince zoom’u sıfırla
    setZoomed(false)
    setZoomOrigin({ x: 50, y: 50 })
  }, [index, lightboxOpen])

  function next() {
    if (sanitized.length === 0) return
    setIndex(i => (i + 1) % sanitized.length)
  }
  function prev() {
    if (sanitized.length === 0) return
    setIndex(i => (i - 1 + sanitized.length) % sanitized.length)
  }

  function openLightbox() {
    if (sanitized.length === 0) return
    if (!enableLightbox) return
    setLightboxOpen(true)
    // küçük bir gecikme ile mount -> opacity/scale animasyonuna izin ver
    setTimeout(() => setLightboxMounted(true), 10)
  }

  function closeLightbox() {
    setLightboxMounted(false)
    setTimeout(() => setLightboxOpen(false), 180)
  }

  useEffect(() => {
    // Aktif küçük resme otomatik kaydır
    const el = trackRef.current?.querySelector<HTMLButtonElement>(`[data-thumb-index="${index}"]`)
    if (el) {
      el.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
    }
  }, [index])

  if (sanitized.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-white">
        <div className="w-full h-full bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 flex items-center justify-center">
          <div className="text-brand-blue/60 text-center p-8">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-sm">Makine görseli yakında eklenecek</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Ana görsel */}
      <div
        className={`relative ${aspect} ${containerClassName ?? 'rounded-xl overflow-hidden shadow-lg bg-white'}`}
        onClick={() => openLightbox()}
      >
        <Image
          key={sanitized[index].url}
          src={sanitized[index].url}
          alt={sanitized[index].alt}
          fill
          className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} select-none ${enableLightbox ? 'cursor-zoom-in' : 'cursor-default'}`}
          sizes={sizesAttr || '(max-width: 1024px) 100vw, 50vw'}
          priority
          quality={92}
        />
        {/* Kontroller */}
        {showArrows && sanitized.length > 1 && (
        <button
          aria-label={t('previousImage')}
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow ring-1 ring-gray-200 hover:bg-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        )}
        {showArrows && sanitized.length > 1 && (
        <button
          aria-label={t('nextImage')}
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow ring-1 ring-gray-200 hover:bg-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        )}
      </div>

      {/* Küçük önizlemeler */}
      {showThumbs && sanitized.length > 1 && (
        <div ref={trackRef} className="flex gap-3 overflow-x-auto pb-1 custom-scroll">
          {sanitized.map((img, i) => (
            <button
              key={img.url + i}
              data-thumb-index={i}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 h-16 w-24 overflow-hidden rounded-lg border ${i === index ? 'border-brand-blue ring-2 ring-brand-blue/30' : 'border-gray-200'} bg-gray-50`}
              aria-label={`Görsel ${i + 1}`}
            >
              <Image src={img.thumb || img.url} alt={img.alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={`fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-default transition-opacity duration-200 ${lightboxMounted ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox() }}
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-900"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <div
            ref={viewerRef}
            className={`relative w-[90vw] h-[80vh] select-none transition-transform duration-200 ${lightboxMounted ? 'scale-100' : 'scale-95'} ${hoveringImage ? (zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in') : 'cursor-default'}`}
            onMouseLeave={() => { setHoveringImage(false); setZoomed(false); setZoomOrigin({ x: 50, y: 50 }) }}
            onMouseMove={(e) => {
              const rect = viewerRef.current?.getBoundingClientRect()
              if (!rect) return
              const containerWidth = rect.width
              const containerHeight = rect.height
              const n = natural
              if (!n) return
              const aspect = n.w / n.h
              let imgWidth = containerWidth
              let imgHeight = containerWidth / aspect
              let offsetX = 0
              let offsetY = 0
              if (imgHeight > containerHeight) {
                imgHeight = containerHeight
                imgWidth = containerHeight * aspect
                offsetX = (containerWidth - imgWidth) / 2
                offsetY = 0
              } else {
                offsetY = (containerHeight - imgHeight) / 2
                offsetX = 0
              }
              const xIn = e.clientX - rect.left
              const yIn = e.clientY - rect.top
              const within = xIn >= offsetX && xIn <= offsetX + imgWidth && yIn >= offsetY && yIn <= offsetY + imgHeight
              setHoveringImage(within)
              if (within) {
                const x = ((xIn - offsetX) / imgWidth) * 100
                const y = ((yIn - offsetY) / imgHeight) * 100
                setZoomOrigin({ x, y })
              } else {
                setZoomed(false)
              }
            }}
            onClick={(e) => {
              if (hoveringImage) {
                e.stopPropagation()
                setZoomed(z => !z)
              }
              // hovering değilse, üst kapsayıcı onClick çalışır ve lightbox kapanır
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={sanitized[index].full || sanitized[index].url}
                alt={sanitized[index].alt}
                fill
                onLoadingComplete={(img) => setNatural({ w: img.naturalWidth, h: img.naturalHeight })}
                className={`object-contain transition-transform duration-200 pointer-events-none`}
                sizes="100vw"
                quality={95}
                style={{ transform: `scale(${zoomed ? 1.6 : 1})`, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
              />
            </div>
          </div>

          {/* Lightbox küçük önizlemeler */}
          <div className="absolute left-0 right-0 bottom-4 px-6">
            <div ref={lightboxTrackRef} className="mx-auto max-w-5xl flex gap-3 overflow-x-auto pb-1">
              {sanitized.map((img, i) => (
                <button
                  key={img.url + i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  className={`relative flex-shrink-0 h-14 w-20 overflow-hidden rounded-md border ${i === index ? 'border-white ring-2 ring-white/50' : 'border-white/30'} bg-white/10`}
                  aria-label={`Görsel ${i + 1}`}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


