'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { client } from '../lib/sanity.client';

// Çok dilli string tipi
interface LocaleString {
  tr?: string;
  ru?: string;
  en?: string;
  uz?: string;
}

// Ürün Tipi interface
interface UrunTipi {
  _id: string;
  ad: LocaleString;
  slug: {
    current: string;
  };
}

// Çok dilli veriyi işleyen yardımcı fonksiyon
function getLocalizedText(localeObj: LocaleString | string | undefined, locale: string = 'ru'): string {
  if (!localeObj) return '';
  if (typeof localeObj === 'string') return localeObj;
  if (localeObj[locale as keyof LocaleString]) {
    return localeObj[locale as keyof LocaleString]!;
  }
  if (localeObj.ru) return localeObj.ru;
  if (localeObj.tr) return localeObj.tr;
  if (localeObj.en) return localeObj.en;
  if (localeObj.uz) return localeObj.uz;
  return '';
}

export default function Footer() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [urunTipleri, setUrunTipleri] = useState<UrunTipi[]>([]);

  useEffect(() => {
    async function fetchUrunTipleri() {
      try {
        const data = await client.fetch(`*[_type == "urunTipi"] | order(ad.tr asc) {
          _id,
          ad,
          slug
        }`);
        setUrunTipleri(data || []);
      } catch (error) {
        console.error('Ürün tipleri yüklenirken hata:', error);
      }
    }
    
    fetchUrunTipleri();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo ve Açıklama */}
          <div className="space-y-6">
            <Link href="/" className="block relative w-48 h-12">
              <Image
                src="/logos/Atakmakinelogo.png"
                alt="Atak Makine Logo"
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              {/* Sosyal Medya İkonları */}
              <SocialLink href="https://www.instagram.com/atakmakineuz/" icon={<InstagramIcon />} label="Instagram" />
              <SocialLink href="https://www.facebook.com/atakmakine.uz" icon={<FacebookIcon />} label="Facebook" />
              <SocialLink href="https://www.youtube.com/@AtakMakineUZ" icon={<YouTubeIcon />} label="YouTube" />
              <SocialLink href="#" icon={<LinkedInIcon />} label="LinkedIn" />
            </div>
          </div>

          {/* Hızlı Linkler - Ürün Tipleri */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">{t('products')}</h3>
            <ul className="space-y-3">
              {urunTipleri.map((tip) => (
                <FooterLink 
                  key={tip._id} 
                  href={`/urunler?tip=${tip.slug.current}`} 
                  label={getLocalizedText(tip.ad, currentLanguage)} 
                />
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">{t('about')}</h3>
            <ul className="space-y-3">
              <FooterLink href="/hakkimizda" label={t('about')} />
              <FooterLink href="/iletisim" label={t('contact')} />
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">{t('contact')}</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <span>2H2X+3PW, Namangan, Namangan Region, Özbekistan</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-brand-blue shrink-0" />
                <a href="tel:+998941672757" className="hover:text-brand-blue transition-colors">+998 94 167 27 57</a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-brand-blue shrink-0" />
                <a href="mailto:info@atakmakine.uz" className="hover:text-brand-blue transition-colors">info@atakmakine.uz</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Çizgi ve Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} Atak Makine. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            Developed by <span className="font-semibold text-gray-700">Digital Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <li>
      <Link href={href} className="text-gray-600 hover:text-brand-blue transition-colors text-sm flex items-center gap-2 group">
        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-brand-blue transition-colors"></span>
        {label}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}

// Icons
function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5.02 3.67 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.5 1.5-3.88 3.77-3.88 1.08 0 2.22.2 2.22.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.33 21.13 22 17.02 22 12z"></path></svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67h-3.57V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.8 0 0 .81 0 1.83v20.34C0 23.19.8 24 1.77 24h20.46c.98 0 1.77-.81 1.77-1.83V1.83C24 .81 23.21 0 22.23 0z"></path></svg>
  )
}

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
  )
}

