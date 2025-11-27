import Link from 'next/link';
import Image from 'next/image';
import { client } from '../lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';
import MakinelerClient, { MakineItem } from './MakinelerClient';

const builder = imageUrlBuilder(client);

interface LocaleString {
  tr?: string;
  ru?: string;
  en?: string;
  uz?: string;
}

interface Makine {
  _id: string;
  model: string;
  baslik: LocaleString;
  anaGorsel: any;
  slug: { current: string } | null;
  urunTipi?: { _id: string; ad?: LocaleString } | null;
  sektor?: { _id: string; ad?: LocaleString }[] | null;
  kategori?: { _id: string; ad?: LocaleString }[] | null;
  marka?: { _id: string; ad?: LocaleString } | null;
}

async function getTumMakineler(): Promise<Makine[]> {
  const query = `*[_type == "makine" && sitedeGoster != false] | order(_createdAt desc) {
    _id,
    model,
    baslik,
    anaGorsel,
    slug,
    urunTipi->{ _id, ad },
    sektor[]->{ _id, ad },
    kategori[]->{ _id, ad },
    marka->{ _id, ad }
  }`;
  try {
    return await client.fetch(query);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function UrunlerPage() {
  const makineler = await getTumMakineler();
  
  // Slug'ı olmayan makineleri konsola yazdır (debug için)
  const slugsizMakineler = makineler.filter(m => !m.slug?.current);
  if (slugsizMakineler.length > 0) {
    console.warn(`${slugsizMakineler.length} makine slug'ı eksik:`, 
      slugsizMakineler.map(m => ({ id: m._id, model: m.model }))
    );
  }
  
  const items: MakineItem[] = makineler.map((m) => ({
    ...m,
    urunTipi: m.urunTipi ? { _id: m.urunTipi._id, baslik: m.urunTipi.ad } : null,
    // Çoklu sektor desteği
    sektor: m.sektor && Array.isArray(m.sektor) 
      ? m.sektor.map(s => ({ _id: s._id, baslik: s.ad }))
      : null,
    // Çoklu kategori desteği  
    kategori: m.kategori && Array.isArray(m.kategori)
      ? m.kategori.map(k => ({ _id: k._id, baslik: k.ad }))
      : null,
    marka: m.marka ? { _id: m.marka._id, baslik: m.marka.ad } : null,
    imageUrl: m.anaGorsel
      ? builder
          .image(m.anaGorsel)
          .width(900) // kart genişliği ~576px; retina netliği için ~2x
          .fit('max')
          .auto('format')
          .quality(85)
          .dpr(2)
          .url()
      : null,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MakinelerClient items={items} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Ürünler - Atak Makine Özbekistan',
  description: 'Tüm ürünlerimizi görüntüleyin.',
};


