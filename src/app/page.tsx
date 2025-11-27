'use client';

import Link from 'next/link';
import Image from 'next/image';
import { client } from './lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './contexts/LanguageContext';
import { useEffect, useState } from 'react';

// Sanity image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Çok dilli string tipi
interface LocaleString {
  tr?: string;
  ru?: string;
  en?: string;
  uz?: string;
}

// Makine tipi tanımı
interface Makine {
  _id: string;
  model: string;
  baslik: LocaleString;
  anaGorsel: any;
  slug: {
    current: string;
  };
}



// Çok dilli veriyi işleyen yardımcı fonksiyon
function getLocalizedText(localeObj: LocaleString | string | undefined, locale: string = 'tr'): string {
  if (!localeObj) return '';
  
  // Eğer string ise direkt döndür
  if (typeof localeObj === 'string') return localeObj;
  
  // Önce istenen dili kontrol et
  if (localeObj[locale as keyof LocaleString]) {
    return localeObj[locale as keyof LocaleString]!;
  }
  
  // Türkçe varsa onu döndür
  if (localeObj.tr) return localeObj.tr;
  
  // Rusça varsa onu döndür
  if (localeObj.ru) return localeObj.ru;
  
  // İngilizce varsa onu döndür
  if (localeObj.en) return localeObj.en;
  
  // Özbekçe varsa onu döndür
  if (localeObj.uz) return localeObj.uz;
  
  // Hiçbiri yoksa boş string döndür
  return '';
}

// Sanity'den makineleri çeken fonksiyon
async function getMakineler(): Promise<Makine[]> {
  const query = `*[_type == "makine" && sitedeGoster != false][0...3] {
    _id,
    model,
    baslik,
    anaGorsel,
    slug
  }`;
  
  try {
    const makineler = await client.fetch(query);
    return makineler;
  } catch (error) {
    console.error('Makineler yüklenirken hata oluştu:', error);
    return [];
  }
}

export default function Home() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [makineler, setMakineler] = useState<Makine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMakineler() {
      setLoading(true);
      try {
        const data = await getMakineler();
        setMakineler(data);
      } catch (error) {
        console.error('Makineler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMakineler();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Bölümü */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Arka Plan Efekti */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-blue/40 z-10"></div>
          {/* Desen eklenebilir */}
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)"/>
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 xl:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight animate-fade-in !text-white">
              <span className="block mb-2">{t('heroTitle1')}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-100 to-white pb-2">
                {t('heroTitle2')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/urunler" className="btn-primary w-full sm:w-auto">
                {t('viewProducts')}
              </Link>
              <Link href="/iletisim" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 hover:-translate-y-[1px]">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Değer Önerileri - Kartlar */}
      <section className="-mt-12 relative z-30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                titleKey: 'expertSupport',
                descKey: 'expertSupportDesc',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                )
              },
              {
                titleKey: 'sparePartsStock',
                descKey: 'sparePartsStockDesc',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>
                )
              },
              {
                titleKey: 'unlimitedQuality',
                descKey: 'unlimitedQualityDesc',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                )
              },
              {
                titleKey: 'oneYearWarranty',
                descKey: 'oneYearWarrantyDesc',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                )
              }
            ].map((item) => (
              <div key={item.titleKey} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özbekistan Mümessilliği */}
      <section className="py-20 lg:py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Logolar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 items-center justify-items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
              {[
                { src: '/logos/durkopp.png', alt: 'Dürkopp Adler' },
                { src: '/logos/pfaff.png', alt: 'Pfaff' },
                { src: '/logos/ksl.png', alt: 'KSL' },
              ].map((logo) => (
                <div key={logo.src} className="relative h-16 w-32 sm:h-20 sm:w-40 transition-transform hover:scale-105">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
                  />
                </div>
              ))}
            </div>

            {/* Metin Bloğu */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-brand-blue text-sm font-semibold tracking-wide uppercase">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span>
                </span>
                {t('uzbekistanRep')}
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading leading-tight">
                {t('authorizedReps')}
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('authorizedDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kısa "Kimiz?" Bölümü */}
      <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
        {/* Arka plan dekorasyon */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-brand-blue font-bold uppercase tracking-wider text-sm mb-2">{t('whoWeAre')}</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading mb-6">{t('aboutTitle')}</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {t('aboutDesc')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    'authorizedServiceSupport',
                    'fastSparePartsSupply',
                    'installationMaintenanceService',
                    'transparentSustainableSolution',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{t(item)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <Link href="/hakkimizda" className="btn-primary">
                    {t('aboutUs')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
              
              <div className="relative h-64 lg:h-auto bg-gray-100 min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-blue/20 flex items-center justify-center">
                  <svg className="w-32 h-32 text-brand-blue/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.3l8.2 4.7-8.2 4.7-8.2-4.7L12 2.3zM3.3 8.8l8.2 4.7v9.4l-8.2-4.7V8.8zm17.4 9.4l-8.2 4.7v-9.4l8.2-4.7v9.4z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Makineler Bölümü */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              {t('featuredMachines')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('featuredMachinesDesc')}
            </p>
          </div>

          {makineler.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center sm:justify-items-stretch">
              {makineler.map((makine) => (
                <Link key={makine._id} href={`/urunler/${makine.slug.current}`} className="group block w-full max-w-xl">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-blue/50">
                    {/* Görsel alanı */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                      {makine.anaGorsel ? (
                        <Image
                          src={urlFor(makine.anaGorsel).width(400).height(300).url()}
                          alt={getLocalizedText(makine.baslik, currentLanguage) || makine.model}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-blue/70">
                          <svg className="w-14 h-14 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 12M3 7h18"/></svg>
                          <span className="text-sm font-medium">{t('preparingVisual')}</span>
                        </div>
                      )}
                    </div>

                    {/* Bilgi alanı */}
                    <div className="p-6">
                      <h3 
                        className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors duration-300"
                        title={getLocalizedText(makine.baslik, currentLanguage) || makine.model}
                      >
                        {getLocalizedText(makine.baslik, currentLanguage) || makine.model}
                      </h3>
                      {makine.model && (
                        <div className="mb-4">
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">{t('model')}: {makine.model}</span>
                        </div>
                      )}
                      <div className="btn-link group-hover:text-blue-600">
                        <span>{t('viewDetails')}</span>
                        <svg className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Makineler Yükleniyor
              </h3>
              <p className="text-gray-600">
                Makine bilgileri Sanity CMS'den yüklenmektedir...
              </p>
            </div>
          )}

          {/* Tüm Makineler Linki */}
          <div className="text-center mt-12 lg:mt-16">
            <Link
              href="/urunler"
              className="btn-link text-lg"
            >
              <span>{t('viewAllMachines')}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* İstatistikler bölümü kullanıcı isteğiyle kaldırıldı */}

      {/* Süreç Adımları */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('purchaseProcess')}</h2>
            <p className="mt-2 text-gray-600">{t('purchaseProcessDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {titleKey: 'needAnalysis', descKey: 'needAnalysisDesc'},
              {titleKey: 'quotationDemo', descKey: 'quotationDemoDesc'},
              {titleKey: 'installation', descKey: 'installationDesc'},
              {titleKey: 'trainingSupport', descKey: 'trainingSupportDesc'},
            ].map((step, i) => (
              <div key={step.titleKey} className="relative bg-white rounded-xl border border-gray-200 p-6">
                <span className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold shadow">{i+1}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{t(step.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-600">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Güçlü CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-2xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold">{t('ctaTitle')}</h3>
              <p className="mt-2 text-white/80 max-w-2xl">{t('ctaDesc')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/urunler" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-brand-blue transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-[1px] hover:bg-gray-50">
                {t('viewProducts')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}