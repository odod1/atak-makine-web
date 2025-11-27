import { redirect } from 'next/navigation';

export default function MakinelerRedirectPage() {
  redirect('/urunler');
}

export const metadata = {
  title: 'Yönlendiriliyor...',
  description: 'Ürünler sayfasına yönlendiriliyorsunuz.',
};
