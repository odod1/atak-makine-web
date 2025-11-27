'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface LocaleString { tr?: string; ru?: string; en?: string; uz?: string }

interface TeknikOzellik {
  baslik?: LocaleString;
  aciklama?: LocaleString;
  degerler?: string[];
  standardMi?: string[]; // Her makine için standard/optional durumunu belirtir (string array)
}

interface TeknikOzelliklerTablosu {
  makineler?: string[];
  ozellikler?: TeknikOzellik[];
  teknikDetaylar?: TeknikOzellik[];
}

interface TechnicalSpecificationsProps {
  teknikOzellikler: TeknikOzelliklerTablosu;
  currentLang?: string; // Server-side'dan gelen dil bilgisi
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

export default function TechnicalSpecifications({ teknikOzellikler, currentLang }: TechnicalSpecificationsProps) {
  const [showFeatures, setShowFeatures] = useState(true);
  const [hoveredTooltip, setHoveredTooltip] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Server-side'dan gelen dil bilgisini öncelikle kullan, yoksa client-side'ı kullan
  const activeLang = currentLang || currentLanguage;

  // Veri kontrolü
  const hasData = teknikOzellikler && teknikOzellikler.makineler;
  const { makineler = [], ozellikler = [], teknikDetaylar = [] } = teknikOzellikler || {};
  
  // Hangi veri setini kullanacağımızı belirle
  const aktifOzellikler = showFeatures ? ozellikler : teknikDetaylar;
  const hasActiveData = aktifOzellikler && Array.isArray(aktifOzellikler) && aktifOzellikler.length > 0;
  
  // Veri yoksa erken return
  if (!hasData) {
    return null;
  }

  if (!hasActiveData) {
    return (
      <div className="mt-24">
        <h2 className="text-2xl font-bold text-black mb-6">
          {t('technicalSpecs')}
        </h2>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex rounded-full bg-gray-200 p-1">
            <button
              onClick={() => setShowFeatures(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                showFeatures ? 'bg-brand-blue text-white shadow' : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              {t('features')}
            </button>
            <button
              onClick={() => setShowFeatures(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !showFeatures ? 'bg-brand-blue text-white shadow' : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              {t('technicalDetails')}
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 py-8">
          {showFeatures ? t('features') : t('technicalDetails')} {t('noDataAvailable')}
        </div>
      </div>
    );
  }
  


  return (
    <div className="mt-24">
              <h2 className="text-2xl font-bold text-black mb-6">
          {t('technicalSpecs')}
        </h2>

      {/* Toggle Switch */}
      <div className="flex justify-center mb-8">
        <div className="relative inline-flex rounded-full bg-gray-100 p-1.5 shadow-inner border border-gray-200">
          <button
            onClick={() => setShowFeatures(true)}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showFeatures ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('features')}
          </button>
          <button
            onClick={() => setShowFeatures(false)}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !showFeatures ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('technicalDetails')}
          </button>
        </div>
      </div>

      {/* Tablo - Modern Tasarım */}
      <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9' }}>
          <table className="w-full" style={{ minWidth: 'max-content' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-2 py-3 md:px-6 md:py-4 text-left text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 z-20 bg-gray-50/95 backdrop-blur border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] min-w-[100px] max-w-[100px] md:min-w-[200px] md:max-w-[200px]">
                  {/* Empty header for machine column */}
                </th>
                {(aktifOzellikler || []).map((ozellik, idx) => {
                  const ozellikBaslik = getLocalizedText(ozellik.baslik, activeLang);
                  const ozellikAciklama = getLocalizedText(ozellik.aciklama, activeLang);
                  
                  return (
                    <th key={idx} className="px-2 py-3 md:px-6 md:py-4 text-center text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wider relative border-r border-gray-100 last:border-r-0 min-w-[110px] md:min-w-[180px]">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="font-bold break-words whitespace-normal">{ozellikBaslik}</span>
                        {ozellikAciklama && (
                          <div className="relative">
                            <div 
                              className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-[8px] md:text-[10px] font-bold cursor-help hover:bg-brand-blue hover:text-white transition-all flex-shrink-0"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top
                                });
                                setHoveredTooltip(idx);
                              }}
                              onMouseLeave={() => {
                                setHoveredTooltip(null);
                                setTooltipPosition(null);
                              }}
                            >
                              ?
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(makineler || []).map((makine, makineIdx) => (
                <tr key={makineIdx} className="group hover:bg-blue-50/30 transition-colors even:bg-gray-50/30">
                  <td className="px-2 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-bold text-brand-blue bg-white group-hover:bg-blue-50/30 transition-colors sticky left-0 z-10 border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] min-w-[100px] max-w-[100px] md:min-w-[200px] md:max-w-[200px]">
                    <div className="truncate" title={makine}>{makine}</div>
                  </td>
                  {(aktifOzellikler || []).map((ozellik, ozellikIdx) => {
                    const deger = ozellik.degerler?.[makineIdx] || '';
                    const standardDurum = (ozellik.standardMi && ozellik.standardMi[makineIdx]) || '';
                    
                    const ikonGosterilsinMi = standardDurum !== '' && standardDurum !== 'İkon Gösterme';
                    const standardMi = standardDurum === 'standard';

                    return (
                      <td key={ozellikIdx} className="px-2 py-3 md:px-6 md:py-4 text-center border-r border-gray-100 last:border-r-0 min-w-[110px] md:min-w-[180px]">
                        <div className="flex items-center justify-center gap-2 min-h-[24px]">
                          {deger && (
                            <span className="text-[11px] md:text-sm font-medium text-gray-700 break-words whitespace-normal">{deger}</span>
                          )}
                          {ikonGosterilsinMi && (
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${
                              standardMi 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}>
                              {standardMi ? (
                                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                              ) : (
                                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                              )}
                            </div>
                          )}
                          {!deger && !ikonGosterilsinMi && (
                            <span className="text-gray-300 text-xl leading-none select-none">·</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend - Her iki modda da göster */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-6 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span>{t('standard')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <span>{t('optional')}</span>
          </div>
        </div>
      </div>

      {/* Portal ile tooltip render et */}
      {mounted && hoveredTooltip !== null && tooltipPosition && (
        createPortal(
          <div 
            className="fixed bg-gray-800 bg-opacity-90 text-white text-sm rounded-lg px-4 py-3 z-[9999] shadow-xl max-w-sm backdrop-blur-sm pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y - 60,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800 border-opacity-90"></div>
            <div className="text-xs leading-relaxed whitespace-pre-line break-words">
              {getLocalizedText((aktifOzellikler || [])[hoveredTooltip]?.aciklama, activeLang)}
            </div>
          </div>,
          document.body
        )
      )}

    </div>
  );
}