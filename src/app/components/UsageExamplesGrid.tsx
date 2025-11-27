'use client';

import { useState } from 'react';
import BenefitModal from './BenefitModal';

type LocaleString = { [key: string]: string };
type LocaleBlock = { [key: string]: any[] };

interface UsageExample {
  baslik?: LocaleString;
  aciklama?: LocaleBlock;
  gorselUrls?: string[];
  videolar?: string[];
  videoDosyaUrls?: string[];
}

interface UsageExamplesGridProps {
  kullanimOrnekleri: UsageExample[];
  currentLang?: string;
}

export default function UsageExamplesGrid({ kullanimOrnekleri, currentLang }: UsageExamplesGridProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  // Sadece dolu öğeleri göster ve aynı listeyi modal için kullan (index kayması olmasın)
  const items = (kullanimOrnekleri || []).filter((f) => !!f && (
    f.baslik || 
    (f.gorselUrls && f.gorselUrls.length > 0) || 
    (f.videolar && f.videolar.length > 0) || 
    (f.videoDosyaUrls && f.videoDosyaUrls.length > 0)
  ));
  const current = openIdx !== null ? items[openIdx] : null;

  const getText = (ls?: LocaleString) => {
    if (!ls) return '';
    const lang = currentLang as keyof LocaleString;
    return ls[lang] || ls.ru || ls.tr || ls.en || ls.uz || '';
  };
  const getBlocks = (lb?: LocaleBlock) => {
    if (!lb) return [];
    const lang = currentLang as keyof LocaleBlock;
    return lb[lang] || lb.ru || lb.tr || lb.en || lb.uz || [];
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((f, idx) => (
            <button key={idx} onClick={() => setOpenIdx(idx)} className="text-left w-full group bg-white border border-gray-100 rounded-lg p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium text-sm leading-relaxed pr-3">{getText(f.baslik)}</p>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-200">
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </button>
          ))}
      </div>

      <BenefitModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={getText(current?.baslik)}
        descriptionBlocks={getBlocks(current?.aciklama)}
        media={[
          ...(current?.gorselUrls || []).map(url => ({ type: 'image', url })),
          ...(current?.videolar || []).map(url => ({ type: 'videoUrl', url })),
          ...(current?.videoDosyaUrls || []).map(url => ({ type: 'videoFile', url }))
        ]}
      />
    </div>
  );
}
