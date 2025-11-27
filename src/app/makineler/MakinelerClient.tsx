'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  slug: { current: string }
  sektor?: RefDoc[] | null
  kategori?: RefDoc[] | null
  marka?: RefDoc | null
  imageUrl?: string | null
}

function getText(v?: LocaleString | string, locale: keyof LocaleString = 'tr') {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v[locale] || v.tr || v.ru || v.en || v.uz || ''
}

export default function MakinelerClient({ items }: { items: MakineItem[] }) {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({ sektor: true, kategori: false, marka: false })
  const [selected, setSelected] = useState<{ sektor: Set<string>; kategori: Set<string>; marka: Set<string> }>(
    { sektor: new Set(), kategori: new Set(), marka: new Set() }
  )

  const facets = useMemo(() => {
    const sektor = new Map<string, string>()
    const kategori = new Map<string, string>()
    const marka = new Map<string, string>()
    for (const it of items) {
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
      sektor: Array.from(sektor, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
      kategori: Array.from(kategori, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
      marka: Array.from(marka, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
    }
  }, [items])

  const filtered = useMemo(() => {
    return items.filter(it => {
      const s = selected.sektor
      const k = selected.kategori
      const m = selected.marka
      // Çoklu sektor kontrolü
      const sOk = s.size === 0 || (it.sektor && Array.isArray(it.sektor) && it.sektor.some(sektor => sektor?._id && s.has(sektor._id)))
      // Çoklu kategori kontrolü
      const kOk = k.size === 0 || (it.kategori && Array.isArray(it.kategori) && it.kategori.some(kategori => kategori?._id && k.has(kategori._id)))
      const mOk = m.size === 0 || (it.marka?._id && m.has(it.marka._id))
      return sOk && kOk && mOk
    })
  }, [items, selected])

  function toggle(kind: 'sektor' | 'kategori' | 'marka', id: string) {
    setSelected(prev => {
      const next = new Set(prev[kind])
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, [kind]: next }
    })
  }

  function clearAll() {
    setSelected({ sektor: new Set(), kategori: new Set(), marka: new Set() })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-1">
      {/* Filters */}
             <aside className="w-full lg:col-span-3 lg:max-w-lg lg:sticky lg:top-24 lg:self-start lg:-ml-24 xl:-ml-40 2xl:-ml-56">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M6 12h12M10 18h4"/></svg>
              </div>
              <span className="text-base md:text-lg font-semibold">Filtrele</span>
            </div>
            <button onClick={clearAll} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-brand-blue rounded-md hover:bg-brand-blue/10">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Temizle
            </button>
          </div>

          <div className="p-4 space-y-3">
            {(['sektor','kategori','marka'] as const).map((kind) => (
              <div key={kind} className="group">
                <button
                  onClick={() => setOpen(o => ({ ...o, [kind]: !o[kind] }))}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50/60 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                     {kind === 'sektor' ? 'Sektörler' : kind === 'kategori' ? 'Kategoriler' : 'Markalar'}
                   </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-gray-200 px-1.5 text-[11px] font-medium text-gray-700">
                       {(facets[kind] as any[]).length}
                     </span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${open[kind] ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                 </button>
                {open[kind] && (
                  <div className="mt-2 px-2 pb-2 max-h-60 overflow-auto">
                    <div className="space-y-1">
                      {(facets[kind] as {id: string; label: string}[]).map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                            checked={selected[kind].has(opt.id)}
                            onChange={() => toggle(kind, opt.id)}
                          />
                          <span className="text-sm text-gray-700 flex-1">{opt.label || '—'}</span>
                        </label>
                      ))}
                    </div>
                    {facets[kind].length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-xs text-gray-500">Bu alanda seçenek bulunmuyor.</p>
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
          <span>Toplam <strong className="text-brand-blue">{filtered.length}</strong> sonuç</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Seçili filtrelere uygun sonuç bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(makine => (
              <Link key={makine._id} href={`/urunler/${makine.slug.current}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-blue/50">
                  <div className="relative aspect-[4/3] bg-gray-50">
                    {makine.imageUrl ? (
                      <Image
                        src={makine.imageUrl}
                        alt={getText(makine.baslik) || makine.model}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-brand-blue/60">
                        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 7h18M3 17h18M7 3v18M17 3v18"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 
                      className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue"
                      title={getText(makine.baslik) || makine.model}
                    >
                      {getText(makine.baslik) || makine.model}
                    </h3>
                    {makine.model && (
                      <p className="mt-1 text-sm text-gray-600">{t('model')}: <span className="font-medium">{makine.model}</span></p>
                    )}
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


