'use client'

import Link from 'next/link'
import { useTranslation } from '../hooks/useTranslation'

export default function AboutPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-blue/40 z-10"></div>
        {/* Desen */}
        <svg className="absolute inset-0 h-full w-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-hero-pattern)"/>
        </svg>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">{t('aboutPageTitle')}</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 !text-white">
              {t('aboutHeroTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {t('aboutHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Kimiz */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading mb-4">{t('whoAreWeTitle')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('whoAreWeParagraph1')}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('whoAreWeParagraph2')}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('whoAreWeParagraph3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon - Vizyon */}
      <section className="py-16 lg:py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-100 p-8 bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-6 text-brand-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">{t('ourMission')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('ourMissionText')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-8 bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">{t('ourVision')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('ourVisionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Güçlerimiz */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading">{t('whyAtakMachine')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titleKey: 'authorizedService', descKey: 'authorizedServiceDesc', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { titleKey: 'qualityStandards', descKey: 'qualityStandardsDesc', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { titleKey: 'fastPartsSupply', descKey: 'fastPartsSupplyDesc', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { titleKey: 'trainingAndSupport', descKey: 'trainingSupportDesc', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            ].map((i) => (
              <div key={i.titleKey} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-10 h-10 bg-brand-blue/5 text-brand-blue rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i.icon} /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">{t(i.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(i.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-2xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-blue/20">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold font-heading">{t('planYourProject')}</h3>
              <p className="mt-2 text-white/80 max-w-2xl text-lg">
                {t('planYourProjectDesc')}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/iletisim" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-brand-blue transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-[1px] hover:bg-gray-50">
                {t('getInTouch')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
