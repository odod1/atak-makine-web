'use client'

import { useState } from 'react'

export default function QuotePage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/teklif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setStatus('success')
        e.currentTarget.reset()
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-blue/40 z-10"></div>
        {/* Desen */}
        <svg className="absolute inset-0 h-full w-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quote-hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quote-hero-pattern)"/>
        </svg>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">TEKLİF AL</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 !text-white">
              İhtiyacınıza özel hızlı teklif
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Kapasite, uygulama ve bütçe bilgileriniz doğrultusunda en doğru makineyi önerip fiyat/termin paylaşalım.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 lg:py-24 -mt-10 relative z-30 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Teklif Formu</h2>
            <p className="text-gray-600 mb-8 text-sm">Zorunlu alanlar * ile belirtilmiştir.</p>

            {status === 'success' && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <p className="font-bold">Talebiniz başarıyla gönderildi!</p>
                    <p className="text-sm">En kısa sürede sizinle iletişime geçeceğiz.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p className="font-bold">Bir hata oluştu.</p>
                    <p className="text-sm">Lütfen daha sonra tekrar deneyin veya doğrudan bizi arayın.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                <input name="adSoyad" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="Adınız Soyadınız" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firma *</label>
                <input name="firma" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="Firma Adı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input name="telefon" type="tel" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="+998 94 167 27 57" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E‑posta</label>
                <input name="email" type="email" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="ornek@mail.com" />
              </div>

              <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İhtiyaç Detayları</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İlgilendiğiniz Makine/Model</label>
                <input name="makine" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="Örn: Juki DDL-8700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adet</label>
                <input name="adet" type="number" min={1} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uygulama / Kumaş Türü</label>
                <input name="uygulama" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="Örn: Kot, Penye, Deri..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                <input name="sehir" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all" placeholder="Teslimat yapılacak şehir" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notlarınız</label>
                <textarea name="not" rows={5} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all resize-none" placeholder="Eklemek istedikleriniz..." />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500">Bilgileriniz KVKK kapsamında korunmaktadır.</p>
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`btn-primary px-8 py-3 shadow-lg hover:shadow-brand-blue/30 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gönderiliyor...
                    </>
                  ) : 'Teklif İste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
