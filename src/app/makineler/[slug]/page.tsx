import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { client } from '../../lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import ImageGallery from '../../components/ImageGallery';
import MachineGalleryButton from '../../components/MachineGalleryButton';
import BenefitsGrid from '../../components/BenefitsGrid';
// import BenefitModal from '../../components/BenefitModal';
import UsageExamplesGrid from '../../components/UsageExamplesGrid';
import TechnicalSpecifications from '../../components/TechnicalSpecifications';
import { translations } from '../../locales/translations';

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

// Çok dilli block tipi
interface LocaleBlock {
  tr?: any[];
  ru?: any[];
  en?: any[];
  uz?: any[];
}

// Makine tipi tanımı
interface Makine {
  _id: string;
  model: string;
  baslik: LocaleString;
  anaGorsel: any;
  detayGorsel?: any;
  detayHeroIndex?: number;
  galeri?: any[];
  youtubeLinki?: string;
  youtubePlaylist?: string;
  // teknikOzellikler kaldırıldı
  giris?: LocaleBlock;
  aciklama?: LocaleBlock;
  aciklamaVurgu?: LocaleString;
  faydalar?: { baslik?: LocaleString; aciklama?: LocaleBlock; gorsel?: any; gorselUrl?: string; videoUrl?: string }[];
  kullanimOrnekleri?: { baslik?: LocaleString; aciklama?: LocaleBlock; gorselUrls?: string[]; videolar?: string[]; videoDosyaUrls?: string[] }[];
          teknikOzelliklerTablosu?: { 
            makineler?: string[]; 
            ozellikler?: { baslik?: LocaleString; aciklama?: LocaleString; degerler?: string[]; standardMi?: string[] }[];
            teknikDetaylar?: { baslik?: LocaleString; aciklama?: LocaleString; degerler?: string[] }[];
          };
  teknikFoy?: any;
  teknikFoyUrl?: string;
  dokumanlar?: { baslik?: string; dosya?: any }[];
  sektor?: any;
  kategori?: any;
  marka?: any;
  urunTipi?: { _id: string; ad?: LocaleString };
  fiyat?: number;
  durum?: string;
  ozellikler?: LocaleString[];
  slug: {
    current: string;
  };
}

// Cookie'den dil okuyacak fonksiyon
function getCurrentLanguage(): string {
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value;
  return language || 'ru'; // Varsayılan dil Rusça
}

// Çeviri fonksiyonu
function t(key: keyof typeof translations.ru, currentLang: string = 'ru'): string {
  const lang = currentLang as keyof typeof translations;
  return translations[lang]?.[key] || translations.ru[key] || key;
}

// Ürün tipine göre "daha fazla bilgi" metnini döndüren fonksiyon
function getWantToKnowMoreText(urunTipi: { _id: string; ad?: LocaleString } | undefined, t: any): string {
  if (!urunTipi?.ad) {
    return t('wantToKnowMore'); // Varsayılan: makine
  }

  // Ürün tipinin Türkçe adını al (slug oluşturmak için)
  const tipAdi = getLocalizedText(urunTipi.ad, 'tr').toLowerCase();

  // Ürün tipine göre uygun metni döndür
  if (tipAdi.includes('malzeme') || tipAdi.includes('material')) {
    return t('wantToKnowMoreMaterial');
  } else if (tipAdi.includes('iğne') || tipAdi.includes('needle') || tipAdi.includes('igna')) {
    return t('wantToKnowMoreNeedle');
  } else if (tipAdi.includes('parça') || tipAdi.includes('part') || tipAdi.includes('qism')) {
    return t('wantToKnowMorePart');
  } else if (tipAdi.includes('makine') || tipAdi.includes('machine') || tipAdi.includes('mashina')) {
    return t('wantToKnowMore');
  } else {
    return t('wantToKnowMoreProduct'); // Genel ürün metni
  }
}

// Çok dilli veriyi işleyen yardımcı fonksiyon
function getLocalizedText(localeObj: LocaleString | string | undefined, locale: string = 'ru'): string {
  if (!localeObj) return '';
  
  // Eğer string ise direkt döndür
  if (typeof localeObj === 'string') return localeObj;
  
  // Önce istenen dili kontrol et (Rusça öncelikli)
  if (localeObj[locale as keyof LocaleString]) {
    return localeObj[locale as keyof LocaleString]!;
  }
  
  // Rusça varsa onu döndür
  if (localeObj.ru) return localeObj.ru;
  
  // Türkçe varsa onu döndür
  if (localeObj.tr) return localeObj.tr;
  
  // İngilizce varsa onu döndür
  if (localeObj.en) return localeObj.en;
  
  // Özbekçe varsa onu döndür
  if (localeObj.uz) return localeObj.uz;
  
  // Hiçbiri yoksa boş string döndür
  return '';
}

// Çok dilli block veriyi işleyen yardımcı fonksiyon
function getLocalizedBlock(localeObj: LocaleBlock | undefined, locale: string = 'ru'): any[] {
  if (!localeObj) return [];
  
  // Önce istenen dili kontrol et (Rusça öncelikli)
  if (localeObj[locale as keyof LocaleBlock]) {
    return localeObj[locale as keyof LocaleBlock]!;
  }
  
  // Rusça varsa onu döndür
  if (localeObj.ru) return localeObj.ru;
  
  // Türkçe varsa onu döndür
  if (localeObj.tr) return localeObj.tr;
  
  // İngilizce varsa onu döndür
  if (localeObj.en) return localeObj.en;
  
  // Özbekçe varsa onu döndür
  if (localeObj.uz) return localeObj.uz;
  
  // Hiçbiri yoksa boş array döndür
  return [];
}

// YouTube URL'den embed ID'sini çıkaran fonksiyon (watch, youtu.be, embed, shorts, live)
function getYouTubeEmbedId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

// Karşılaştırma tablosu tipi
interface KarsilastirmaTablosu {
  _id: string;
  baslik?: LocaleString;
  makineler?: {
    _id: string;
    model: string;
    baslik?: LocaleString;
  }[];
  ozellikler?: {
    baslik?: LocaleString;
    aciklama?: LocaleString;
    degerler?: string[];
    standardMi?: string[];
  }[];
  kategori?: {
    _id: string;
    isim?: LocaleString;
  };
  sira?: number;
}

// Bu makineyi içeren karşılaştırma tablolarını çeken fonksiyon
async function getMakineKarsilastirmaTablolari(makineId: string): Promise<KarsilastirmaTablosu[]> {
  const query = `*[_type == "teknikOzelliklerTablosu" && references($makineId)] | order(sira asc) {
    _id,
    baslik,
    makineler[]->{
      _id,
      model,
      baslik
    },
    ozellikler[]{
      baslik,
      aciklama,
      degerler,
      standardMi
    },
    kategori->{
      _id,
      isim
    },
    sira
  }`;
  
  try {
    const tablolar = await client.fetch(query, { makineId });
    return tablolar || [];
  } catch (error) {
    console.error('Karşılaştırma tabloları çekilirken hata:', error);
    return [];
  }
}

// Sanity'den tek makine çeken fonksiyon
async function getMakine(slug: string): Promise<Makine | null> {
  const query = `*[_type == "makine" && slug.current == $slug && sitedeGoster != false][0] {
    _id,
    model,
    baslik,
    anaGorsel,
    detayGorsel,
    detayHeroIndex,
    galeri,
    youtubeLinki,
    youtubePlaylist,
    // teknikOzellikler kaldırıldı
    giris,
    aciklama,
    aciklamaVurgu,
    teknikFoy,
    "teknikFoyUrl": teknikFoy.asset->url,
    dokumanlar[]{ baslik, dosya, "url": dosya.asset->url },
    faydalar[_type == "fayda"]{
      baslik,
      aciklama,
      gorseller,
      "gorselUrls": gorseller[].asset->url,
      videolar,
      videoDosyalar,
      "videoDosyaUrls": videoDosyalar[].asset->url
    },
    kullanimOrnekleri[_type == "fayda"]{
      baslik,
      aciklama,
      gorseller,
      "gorselUrls": gorseller[].asset->url,
      videolar,
      videoDosyalar,
      "videoDosyaUrls": videoDosyalar[].asset->url
    },
              teknikOzelliklerTablosu{
            makineler,
            ozellikler[]{
              baslik,
              aciklama,
              degerler,
              standardMi
            },
            teknikDetaylar[]{
              baslik,
              aciklama,
              degerler,
              standardMi
            }
          },
    sektor[]->{
      _id,
      ad
    },
    kategori[]->{
      _id,
      ad
    },
    marka->{
      _id,
      ad
    },
    urunTipi->{
      _id,
      ad
    },
    fiyat,
    durum,
    ozellikler,
    slug
  }`;
  
  try {
    const makine = await client.fetch(query, { slug });
    return makine;
  } catch (error) {
    console.error('Makine yüklenirken ilk sorguda hata oluştu, basit sorguya düşülüyor:', error);
    // Şema henüz deploy edilmediyse veya yeni alanlar sorun çıkarırsa basit sorgu ile tekrar dene
    const fallbackQuery = `*[_type == "makine" && slug.current == $slug && sitedeGoster != false][0] {
      _id, model, baslik, anaGorsel, detayGorsel, detayHeroIndex, galeri,
      youtubeLinki, youtubePlaylist, giris, aciklama, aciklamaVurgu,
      teknikFoy, "teknikFoyUrl": teknikFoy.asset->url,
      dokumanlar[]{ baslik, dosya, "url": dosya.asset->url },
      urunTipi->{ _id, ad },
      slug
    }`;
    try {
      const makine = await client.fetch(fallbackQuery, { slug });
      return makine;
    } catch (e2) {
      console.error('Makine fallback sorgusunda da hata oluştu:', e2);
      return null;
    }
  }
}

// PortableText için özel componentler
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="font-body mb-6 text-gray-600 leading-loose text-lg antialiased">{children}</p>,
    h1: ({ children }: any) => <h1 className="font-heading tracking-tight text-3xl font-bold text-gray-900 mb-6 mt-10">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-heading tracking-tight text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-heading tracking-tight text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="font-body list-disc list-inside mb-6 space-y-2 text-gray-600 text-lg marker:text-brand-blue">{children}</ul>,
    number: ({ children }: any) => <ol className="font-body list-decimal list-inside mb-6 space-y-2 text-gray-600 text-lg marker:text-brand-blue marker:font-bold">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
    number: ({ children }: any) => <li className="pl-2">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
  },
};

// Sayfa parametreleri tipi
interface PageProps {
  params: {
    slug: string;
  };
}

// Metadata oluşturma fonksiyonu
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const makine = await getMakine(params.slug);
  
  if (!makine) {
    return {
      title: 'Makine Bulunamadı - Atak Makine Özbekistan',
      description: 'Aradığınız makine bulunamadı.',
    };
  }

  const baslik = getLocalizedText(makine.baslik, getCurrentLanguage());
  const title = baslik || makine.model;
  
  return {
    title: `${title} - Atak Makine Özbekistan`,
    description: `${title} detayları, teknik özellikleri ve fiyat bilgileri. Endüstriyel makine çözümleri için Atak Makine Özbekistan.`,
    openGraph: {
      title: `${title} - Atak Makine Özbekistan`,
      description: `${title} detayları ve teknik özellikleri`,
      images: makine.anaGorsel ? [urlFor(makine.anaGorsel).width(800).height(600).url()] : [],
    },
  };
}

export default async function MakineDetayPage({ params }: PageProps) {
  const makine = await getMakine(params.slug);

  // Makine bulunamazsa 404 sayfasına yönlendir
  if (!makine) {
    notFound();
  }

  // Bu makineyi içeren karşılaştırma tablolarını çek
  const karsilastirmaTablolari = await getMakineKarsilastirmaTablolari(makine._id);

  // Cookie'den mevcut dili al
  const currentLang = getCurrentLanguage();
  
  const baslik = getLocalizedText(makine.baslik, currentLang);
  // teknikOzellikler kaldırıldı
  const giris = getLocalizedBlock(makine.giris, currentLang);
  const aciklama = getLocalizedBlock(makine.aciklama, currentLang);
  const aciklamaVurgu = getLocalizedText(makine.aciklamaVurgu, currentLang);
  const faydalarList = Array.isArray(makine.faydalar)
    ? makine.faydalar.map((o) => getLocalizedText(o, currentLang)).filter((t) => Boolean(t && t.trim()))
    : [] as string[];
  const youtubeEmbedId = makine.youtubeLinki ? getYouTubeEmbedId(makine.youtubeLinki) : null;
  const katalogUrl = makine.teknikFoyUrl || null;
  // Görüntü kalitesi için farklı boyutlar: ana görünüm, lightbox, küçük önizleme
  const imageUrlForSize = (src: any, w: number, h: number) =>
    urlFor(src)
      .width(w)
      .height(h)
      .fit('max')
      .auto('format')
      .quality(95)
      .dpr(2)
      .url();

  // Hero seçim önceliği: 1) detayGorsel 2) anaGorsel (galeri karışmaz)
  const heroImage = makine.detayGorsel || makine.anaGorsel

  // Hero görsel için ayrı array (sadece hero)
  const heroImages = heroImage
    ? [{
        // Daha keskin hero: genişlik 2400, 21:9 orana uygun yükseklik (~1020)
        url: imageUrlForSize(heroImage, 2400, 1020),
        full: imageUrlForSize(heroImage, 3200, 1360),
        thumb: imageUrlForSize(heroImage, 400, 300),
        alt: baslik || makine.model,
      }]
    : [];

  // Galeri görselleri için ayrı array (sadece galeri içeriği)
  const galleryImages = Array.isArray(makine.galeri)
    ? makine.galeri.map((g: any, i: number) => ({
        url: imageUrlForSize(g, 1400, 1050),
        full: imageUrlForSize(g, 2600, 1950),
        thumb: imageUrlForSize(g, 400, 300),
        alt: `${baslik || makine.model} - Galeri ${i + 1}`,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-36 pb-8 lg:pb-12">
        {/* Üst Hero Görsel (Sabit - galeri karışmaz) */}
        <div className="mb-0">
          {/* Hero görsel sabit kalır, lightbox yok */}
          <div className="hero-image">
            <ImageGallery
              images={heroImages}
              aspectClass="aspect-[21/9]"
              fit="contain"
              sizesAttr="100vw"
              containerClassName="overflow-hidden"
              showThumbs={false}
              showArrows={false}
              enableLightbox={false}
            />
          </div>
        </div>



        {/* Breadcrumb (kompakt) - görselin altına taşındı */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-4 lg:mb-6">
          <nav className="flex items-center space-x-2 text-xs md:text-[13px]">
            <Link href="/" className="text-gray-500 hover:text-brand-blue transition-colors">{t('homePage', currentLang)}</Link>
            <span className="text-gray-400">/</span>
            <Link href="/urunler" className="text-gray-500 hover:text-brand-blue transition-colors">{t('allProducts', currentLang)}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-brand-blue font-medium truncate">{baslik || makine.model}</span>
          </nav>
        </div>

        {/* İçerik alanı (tek sütun) */}
        <div className="space-y-8">
          {/* Başlık ve Model */}
          <div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 leading-snug tracking-wide">
                {baslik || makine.model}
              </h1>
              {giris && giris.length > 0 && (
                <div className="prose max-w-none mb-4">
                  <PortableText value={giris} components={portableTextComponents} />
                </div>
              )}

              {aciklamaVurgu && (
                <p className="text-sm sm:text-base tracking-wide uppercase font-semibold text-gray-900 mb-2">
                  {aciklamaVurgu}
                </p>
              )}

              {aciklama && aciklama.length > 0 && (
                <div className="prose max-w-none mb-10">
                  <PortableText value={aciklama} components={portableTextComponents} />
                </div>
              )}

              {/* Aksiyonlar - ikon butonlar */}
              <div className="flex flex-wrap items-center gap-4 mt-10 mb-8 pb-8 border-b border-gray-100">
                {makine.youtubeLinki && (
                  <Link
                    href={makine.youtubeLinki}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Makine Videosu"
                    title="Makine Videosu"
                    className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Video</span>
                  </Link>
                )}
                {makine.youtubePlaylist && (
                  <Link
                    href={makine.youtubePlaylist}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="İlgili Diğer Videolar"
                    title="İlgili Diğer Videolar"
                    className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10"/></svg>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Playlist</span>
                  </Link>
                )}
                {/* Galeri ikonu - sadece galeri varsa göster */}
                <MachineGalleryButton hasGallery={galleryImages.length > 0} galleryImages={galleryImages} />
                {katalogUrl && (
                  <a
                    href={katalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ürün Kataloğu (PDF)"
                    title="Ürün Kataloğu (PDF)"
                    className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-600 shadow-sm border border-gray-200 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h6" />
                    </svg>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Katalog</span>
                  </a>
                )}
              </div>

              {/* Sunduğu Avantajlar */}
              {Array.isArray(makine.faydalar) && makine.faydalar.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('benefitsOffered', currentLang)}</h3>
                  <BenefitsGrid faydalar={makine.faydalar as any} currentLang={currentLang} />
                </div>
              )}

              {/* Kullanım Örnekleri */}
              {Array.isArray(makine.kullanimOrnekleri) && makine.kullanimOrnekleri.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('usageExamples', currentLang)}</h3>
                  <UsageExamplesGrid kullanimOrnekleri={makine.kullanimOrnekleri as any} currentLang={currentLang} />
                </div>
              )}

              {/* Karşılaştırma Tabloları */}
              {karsilastirmaTablolari.length > 0 && (
                <div className="mt-12 space-y-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('technicalSpecsComparison', currentLang)}</h2>
                    <p className="text-lg text-gray-600">
                      {t('technicalSpecsComparisonDesc', currentLang)}
                    </p>
                  </div>
                  
                  {karsilastirmaTablolari.map((tablo) => {
                    // Tabloyu TechnicalSpecifications bileşeni için uygun formata çevir
                    const teknikOzelliklerData = {
                      makineler: tablo.makineler?.map(makine => 
                        getLocalizedText(makine.baslik, currentLang) || makine.model
                      ) || [],
                      ozellikler: tablo.ozellikler?.map(ozellik => ({
                        baslik: ozellik.baslik,
                        aciklama: ozellik.aciklama,
                        degerler: ozellik.degerler || [],
                        standardMi: ozellik.standardMi || []
                      })) || []
                    };

                    const tabloBaslik = getLocalizedText(tablo.baslik, currentLang);
                    const kategoriIsim = getLocalizedText(tablo.kategori?.isim, currentLang);

                    return (
                      <div key={tablo._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        {/* Tablo Başlığı */}
                        <div className="bg-gradient-to-r from-brand-blue to-blue-600 px-8 py-6">
                          <h3 className="text-2xl font-bold text-white">
                            {tabloBaslik}
                          </h3>
                          {kategoriIsim && (
                            <p className="text-blue-100 mt-2">
                              {t('category', currentLang)}: {kategoriIsim}
                            </p>
                          )}
                        </div>

                        {/* Tablo İçeriği */}
                        <div className="p-0">
                          {teknikOzelliklerData.makineler.length > 0 && teknikOzelliklerData.ozellikler.length > 0 ? (
                            <TechnicalSpecifications teknikOzellikler={teknikOzelliklerData} currentLang={currentLang} />
                          ) : (
                            <div className="p-8 text-center text-gray-500">
                              {t('noDataAddedYet', currentLang)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

                            {/* Makine İçindeki Teknik Özellikler Tablosu */}
              {karsilastirmaTablolari.length === 0 && makine.teknikOzelliklerTablosu && makine.teknikOzelliklerTablosu.makineler && makine.teknikOzelliklerTablosu.ozellikler && makine.teknikOzelliklerTablosu.ozellikler.length > 0 && (
                 <TechnicalSpecifications teknikOzellikler={makine.teknikOzelliklerTablosu as any} currentLang={currentLang} />
               )}

              {/* Durum rozeti kaldırıldı */}
            </div>

            {/* Fiyat gösterimi istenmiyor */}

            {/* Teknik Özellikler bölümü kaldırıldı */}

            {/* Öne Çıkan Teknik Özellikler bölümü kaldırıldı */}

            {/* İletişim Aksiyonları */}
            <div className="bg-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('wantToKnowMoreProduct', currentLang)}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('contactExpertsDesc', currentLang)}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/80 text-brand-blue ring-1 ring-brand-blue/20 hover:bg-brand-blue/5 transition shadow-sm hover:shadow-md"
                >
                  {t('contactUs', currentLang)}
                </Link>
              </div>
            </div>
          </div>

        {/* Geri Dön Butonu */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/urunler"
            className="inline-flex items-center text-gray-600 hover:text-brand-blue font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('backToAllProducts', currentLang)}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Bu dosyanın sonunda tanımlı client olmayan geçici ızgara bileşenleri kaldırıldı; ayrı client bileşeni `components/BenefitsGrid.tsx` kullanılmaktadır.
