'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'tr' | 'en' | 'uz';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');

  // localStorage ve cookie'den dil tercihini oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Önce cookie'den oku
      const cookieLanguage = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1] as Language;
      
      // Sonra localStorage'dan oku
      const savedLanguage = localStorage.getItem('preferred-language') as Language;
      
      // Cookie varsa onu kullan, yoksa localStorage'u kullan
      const preferredLanguage = cookieLanguage || savedLanguage;
      
      if (preferredLanguage && ['ru', 'tr', 'en', 'uz'].includes(preferredLanguage)) {
        setCurrentLanguage(preferredLanguage);
        // Her ikisini de senkronize et
        localStorage.setItem('preferred-language', preferredLanguage);
        document.cookie = `language=${preferredLanguage}; path=/; max-age=${365 * 24 * 60 * 60}`;
      }
    }
  }, []);

  // Dil değiştiğinde localStorage ve cookie'ye kaydet
  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
      // Cookie'ye de yaz (server components için)
      document.cookie = `language=${lang}; path=/; max-age=${365 * 24 * 60 * 60}`; // 1 yıl
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
