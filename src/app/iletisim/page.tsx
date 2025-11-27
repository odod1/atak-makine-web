'use client'

import Link from 'next/link'
import { useTranslation } from '../hooks/useTranslation'
import { useState } from 'react'

export default function ContactPage() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Form elementini kaydet (async işlemden sonra e.currentTarget null olur)
    const form = e.currentTarget

    const formData = new FormData(form)
    const data = {
      adSoyad: formData.get('adSoyad') as string,
      firma: formData.get('firma') as string,
      telefon: formData.get('telefon') as string,
      email: formData.get('email') as string,
      mesaj: formData.get('mesaj') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }))
        setSubmitStatus('error')
        setMessage(errorData.error || 'Mesaj gönderilirken bir hata oluştu.')
        return
      }

      const result = await response.json()

        setSubmitStatus('success')
        setMessage(result.message)
        // Formu temizle
      form.reset()
    } catch (error) {
      console.error('Form gönderme hatası:', error)
      setSubmitStatus('error')
      setMessage('Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-20 lg:py-28 overflow-hidden">
        {/* Arka Plan Efekti */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-blue/40 z-10"></div>
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contact-hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-hero-pattern)"/>
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">{t('contactPageTitle')}</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 !text-white">
              {t('contactHeroTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {t('contactHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-16 lg:py-24 -mt-10 relative z-30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bilgi kutuları */}
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-heading">{t('contactInfo')}</h2>
                <div className="space-y-6">
                  {/* Telefon */}
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 5.5C2 4.12 3.12 3 4.5 3h1.06c.58 0 1.12.28 1.45.75l1.37 1.94a1.7 1.7 0 01-.15 2.13l-1 1.05a.7.7 0 00-.1.86c1.1 1.88 2.7 3.48 4.58 4.58.3.18.68.14.94-.1l1.05-1.01c.6-.58 1.53-.65 2.2-.16l1.95 1.37c.47.33.75.87.75 1.45V19.5c0 1.38-1.12 2.5-2.5 2.5H15A15 15 0 012 5.5z"/></svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{t('phone')}</p>
                      <a href="tel:+998941672757" className="text-lg font-semibold text-gray-900 hover:text-brand-blue transition-colors">+998 94 167 27 57</a>
                    </div>
                  </div>
                  
                  {/* E-posta */}
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{t('email')}</p>
                      <a href="mailto:info@atakmakine.uz" className="text-lg font-semibold text-gray-900 hover:text-brand-blue transition-colors">info@atakmakine.uz</a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-3">Hızlı İletişim</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="https://wa.me/998941672757"
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#25D366] text-white px-4 py-2 text-sm font-semibold hover:bg-[#128C7E] transition shadow-sm hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.78 11.78 0 0012 0C5.37 0 .03 5.34.03 11.94c0 2.1.55 4.1 1.6 5.9L0 24l6.28-1.64a11.87 11.87 0 005.72 1.46h.01c6.63 0 12-5.34 12-11.94 0-3.2-1.26-6.2-3.49-8.4zM12 21.34h-.01a9.86 9.86 0 01-5.02-1.37l-.36-.21-3.73.97 1-3.63-.24-.37A9.6 9.6 0 012.1 11.94C2.1 6.45 6.67 1.98 12 1.98c2.59 0 5.03 1.01 6.86 2.83A9.52 9.52 0 0121.9 12c0 5.5-4.57 9.95-9.9 9.95zm5.62-7.19c-.31-.16-1.83-.9-2.12-1.01-.29-.11-.5-.16-.72.16-.22.32-.83 1.01-1.02 1.22-.19.21-.37.24-.68.08-.31-.16-1.31-.48-2.49-1.53-.92-.81-1.54-1.81-1.73-2.12-.19-.32-.02-.49.14-.65.14-.14.31-.37.47-.55.16-.19.21-.32.31-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.72-.99-2.35-.26-.63-.52-.55-.72-.56l-.62-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.64s1.12 3.06 1.28 3.27c.16.21 2.2 3.36 5.33 4.72.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.83-.75 2.09-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37z"/></svg>
                        WhatsApp
                      </Link>
                      <Link
                        href="https://t.me/+998941672757"
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#229ED9] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1A7CB0] transition shadow-sm hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 15.47l-.37 5.23c.53 0 .77-.23 1.05-.5l2.53-2.41 5.24 3.84c.96.53 1.64.25 1.9-.89l3.44-16.13h.01c.31-1.45-.52-2.02-1.44-1.67L1.5 9.87c-1.4.54-1.39 1.31-.24 1.66l5.92 1.85 13.73-8.67c.64-.39 1.22-.17.74.22"/></svg>
                        Telegram
                      </Link>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{t('address')}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">2H2X+3PW, Namangan, Namangan Region, Özbekistan</p>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {t('workingHours')}: {t('workingHoursText')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-lg overflow-hidden">
                <iframe
                  title="Harita"
                  className="w-full h-64 rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=41.000248814694764,71.59932640387771&z=16&output=embed"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">{t('writeToUs')}</h2>
                <p className="text-gray-600 mb-8">{t('writeToUsDesc')}</p>
                
                {/* Durum mesajları */}
                {submitStatus !== 'idle' && (
                  <div className={`mb-8 p-4 rounded-xl border ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 text-green-800 border-green-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  } animate-fade-in`}>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {submitStatus === 'success' ? (
                          <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="font-medium">{message}</p>
                    </div>
                  </div>
                )}

                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('firstName')}</label>
                    <input name="adSoyad" required disabled={isSubmitting} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('company')}</label>
                    <input name="firma" disabled={isSubmitting} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Firma Adı" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                    <input name="telefon" type="tel" required disabled={isSubmitting} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" placeholder="+998 94 167 27 57" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input name="email" type="email" disabled={isSubmitting} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" placeholder="ornek@mail.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('yourMessage')}</label>
                    <textarea name="mesaj" rows={6} required disabled={isSubmitting} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-2 ring-transparent focus:border-brand-blue focus:ring-brand-blue/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Mesajınız..." />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between pt-4">
                    <p className="text-xs text-gray-500">Kişisel verileriniz güvendedir.</p>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-brand-blue/30"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Gönderiliyor...
                        </>
                      ) : (
                        t('sendButton')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
