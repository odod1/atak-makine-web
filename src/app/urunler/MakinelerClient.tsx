'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../hooks/useTranslation'

type LocaleString = {
  tr?: string
  ru?: string
  en?: string
  uz?: string
}

type RefDoc = {
  _id: string
  baslik?: LocaleString | string
}

export type MakineItem = {
  _id: string
  model: string
  baslik: LocaleString | string
  anaGorsel?: { [key: string]: any } | null
  slug: { current: string } | null
  urunTipi?: RefDoc | null
  sektor?: RefDoc[] | null
  kategori?: RefDoc[] | null
  marka?: RefDoc | null
  imageUrl?: string | null
}

export default function MakinelerClient({ items }: { items: MakineItem[] }) {
  const { currentLanguage } = useLanguage()
  const { t } = useTranslation()
  
  function getText(v?: LocaleString | string, locale: keyof LocaleString = currentLanguage as keyof LocaleString) {
    if (!v) return ''
    if (typeof v === 'string') return v
    return v[locale] || v.tr || v.ru || v.en || v.uz || ''
  }
  const [open, setOpen] = useState<{ [key: string]: boolean }>({ urunTipi: true, sektor: false, kategori: false, marka: false })
  const [selected, setSelected] = useState<{ urunTipi: Set<string>; sektor: Set<string>; kategori: Set<string>; marka: Set<string> }>(
    { urunTipi: new Set(), sektor: new Set(), kategori: new Set(), marka: new Set() }
  )

  const facets = useMemo(() => {
    const urunTipi = new Map<string, string>()
    const sektor = new Map<string, string>()
    const kategori = new Map<string, string>()
    const marka = new Map<string, string>()
    for (const it of items) {
      // Sadece slug'ı olan makineleri facets'e dahil et
      if (!it.slug?.current) continue
      
      if (it.urunTipi?._id) urunTipi.set(it.urunTipi._id, getText(it.urunTipi.baslik))
      // Çoklu sektor desteği
      if (it.sektor && Array.isArray(it.sektor)) {
        it.sektor.forEach(s => {
          if (s?._id) sektor.set(s._id, getText(s.baslik))
        })
      }
      // Çoklu kategori desteği
      if (it.kategori && Array.isArray(it.kategori)) {
        it.kategori.forEach(k => {
          if (k?._id) kategori.set(k._id, getText(k.baslik))
        })
      }
      if (it.marka?._id) marka.set(it.marka._id, getText(it.marka.baslik))
    }
    return {
      urunTipi: Array.from(urunTipi, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
      sektor: Array.from(sektor, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
      kategori: Array.from(kategori, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
      marka: Array.from(marka, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
    }
  }, [items, currentLanguage]) // currentLanguage'i dependency'ye ekledik

  const filtered = useMemo(() => {
    // 1. Filtreleme
    const filteredItems = items.filter(it => {
      // Slug kontrolü - slug'ı olmayan makineleri filtrele
      if (!it.slug?.current) return false
      
      const u = selected.urunTipi
      const s = selected.sektor
      const k = selected.kategori
      const m = selected.marka
      const uOk = u.size === 0 || (it.urunTipi?._id && u.has(it.urunTipi._id))
      // Çoklu sektor kontrolü
      const sOk = s.size === 0 || (it.sektor && Array.isArray(it.sektor) && it.sektor.some(sektor => sektor?._id && s.has(sektor._id)))
      // Çoklu kategori kontrolü
      const kOk = k.size === 0 || (it.kategori && Array.isArray(it.kategori) && it.kategori.some(kategori => kategori?._id && k.has(kategori._id)))
      const mOk = m.size === 0 || (it.marka?._id && m.has(it.marka._id))
      return uOk && sOk && kOk && mOk
    })

    // 2. Sıralama (Markaya göre)
    // Sıralama önceliği: Durkopp Adler > Pfaff > KSL > Diğerleri
    return filteredItems.sort((a, b) => {
      const brandA = getText(a.marka?.baslik).toLowerCase();
      const brandB = getText(b.marka?.baslik).toLowerCase();

      const priority = ['durkopp adler', 'pfaff', 'ksl'];

      const indexA = priority.findIndex(p => brandA.includes(p));
      const indexB = priority.findIndex(p => brandB.includes(p));

      // İkisi de öncelikli listede varsa, listedeki sıraya göre
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // Sadece A listedeyse, A öne geçer
      if (indexA !== -1) return -1;
      
      // Sadece B listedeyse, B öne geçer
      if (indexB !== -1) return 1;

      // İkisi de listede yoksa, varsayılan (tarih veya ID) sırasını koru
      return 0;
    });
  }, [items, selected, currentLanguage])

  function toggle(kind: 'urunTipi' | 'sektor' | 'kategori' | 'marka', id: string) {
    setSelected(prev => {
      const next = new Set(prev[kind])
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, [kind]: next }
    })
  }

  function clearAll() {
    setSelected({ urunTipi: new Set(), sektor: new Set(), kategori: new Set(), marka: new Set() })
  }

  // Eğer hiç ürün yoksa boş mesajı göster
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">{t('noProductsFound')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-1">
      {/* Filters */}
		<aside className="w-full lg:col-span-3 lg:max-w-lg lg:sticky lg:top-32 lg:self-start lg:-ml-24 xl:-ml-40 2xl:-ml-56">
			<div className="rounded-2xl bg-white/90 backdrop-blur border border-white/80 shadow-lg ring-1 ring-black/5 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-brand-blue/5 to-transparent">
					<div className="flex items-center gap-2 text-gray-900">
						<div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
							<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M6 12h12M10 18h4"/></svg>
						</div>
						<span className="text-base md:text-lg font-semibold">{t('filter')}</span>
					</div>
					<button onClick={clearAll} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-blue rounded-full bg-white ring-1 ring-brand-blue/20 hover:bg-brand-blue/10">
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
						{t('clear')}
					</button>
				</div>

          <div className="p-4 space-y-3">
				{(['urunTipi','sektor','kategori','marka'] as const).map((kind) => (
              <div key={kind} className="group">
                <button
                  onClick={() => setOpen(o => ({ ...o, [kind]: !o[kind] }))}
							className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:border-brand-blue/30 hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    {kind === 'urunTipi' ? t('productTypes') : kind === 'sektor' ? t('sectors') : kind === 'kategori' ? t('categories') : t('brands')}
                  </span>
                  <div className="flex items-center gap-2">
								<span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-brand-blue/10 px-1.5 text-[11px] font-medium text-brand-blue">
                      {(facets[kind] as any[]).length}
                    </span>
								<svg className={`w-5 h-5 text-gray-400 transition-transform ${open[kind] ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </button>
                {open[kind] && (
                  <div className="mt-2 px-2 pb-2 max-h-60 overflow-auto">
                    <div className="space-y-1">
									{(facets[kind] as {id: string; label: string}[]).map(opt => (
										<label key={opt.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-brand-blue/5 ${selected[kind].has(opt.id) ? 'bg-brand-blue/5 text-brand-blue' : 'text-gray-700'}`}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                            checked={selected[kind].has(opt.id)}
                            onChange={() => toggle(kind, opt.id)}
                          />
											<span className="text-sm flex-1">{opt.label || '—'}</span>
                        </label>
                      ))}
                    </div>
                    {facets[kind].length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-xs text-gray-500">{t('noResultsFound')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Results */}
      <section className="lg:col-span-9 -ml-6 sm:-ml-10 md:-ml-14 lg:-ml-20 xl:-ml-28 2xl:-ml-40">
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>{t('totalResults')} <strong className="text-brand-blue">{filtered.length}</strong></span>
        </div>

			{filtered.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-gray-600">{t('noResultsFound')}</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{filtered.map(makine => (
						<Link key={makine._id} href={`/urunler/${makine.slug?.current || makine._id}`} className="group block">
							<div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-blue/50 h-full">
								<div className="relative bg-white aspect-[4/3]">
									{makine.imageUrl ? (
										<Image
											src={makine.imageUrl}
											alt={getText(makine.baslik) || makine.model}
											fill
											className="object-contain transition-transform duration-500"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center text-brand-blue/60">
											<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 7h18M3 17h18M7 3v18M17 3v18"/></svg>
										</div>
									)}
								</div>
								<div className="p-4 flex flex-col flex-1 justify-between">
									<div>
										<h3 
											className="text-sm font-semibold text-gray-900 group-hover:text-brand-blue line-clamp-2 leading-tight mb-2"
											title={getText(makine.baslik) || makine.model}
										>
											{getText(makine.baslik) || makine.model}
										</h3>
										{makine.model && (
											<p className="text-xs text-gray-600">{t('model')}: <span className="font-medium">{makine.model}</span></p>
										)}
									</div>
									<div className="mt-3 btn-link text-xs group-hover:text-blue-600">
										<span>{t('viewDetails')}</span>
										<svg className="w-3 h-3 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
      </section>
    </div>
  )
}



