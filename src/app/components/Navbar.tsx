'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation'; 

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  // Scroll efektini takip et
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Panel sayfasında bu navbar görünmesin
  if (pathname?.startsWith('/panel')) return null;

  // Menü linklerini burada bir dizi olarak tanımlayalım, yönetimi kolay olur
  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/urunler', label: t('products') }, // '/makineler' yerine '/urunler' kullandık, tutarlılık için
    { href: '/hakkimizda', label: t('about') },
    { href: '/iletisim', label: t('contact') },
  ];

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-white py-4 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Alanı */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Atak Makine Anasayfa">
              <Image
                src="/logos/Atakmakinelogo.png"
                alt="Atak Makine Logo"
                width={180}
                height={40}
                unoptimized
                priority
                style={{ width: 'auto', height: '40px' }}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Masaüstü Menü Linkleri */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="relative group text-[15px] font-medium text-gray-600 hover:text-brand-blue transition-colors py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sağ Taraf Aksiyonları */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
                href="/giris"
                className="text-sm font-medium text-gray-500 hover:text-blue-900 transition-colors flex items-center gap-1"
                title="Bayi / Servis Girişi"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                {t('login')}
            </Link>
            <div className="w-auto">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobil Menü Butonu (Hamburger) */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-50 inline-flex items-center justify-center p-2.5 rounded-lg text-gray-500 hover:text-brand-blue hover:bg-blue-50 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {/* İkonlar */}
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü (Açılır Kapanır) */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg`} id="mobile-menu">
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-brand-blue hover:bg-blue-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 py-3 border-t border-gray-50 mt-2 flex items-center justify-between">
            <LanguageSwitcher dropdownAlign="left" />
            <Link 
                href="/giris"
                className="text-sm font-bold text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
                onClick={() => setIsOpen(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
