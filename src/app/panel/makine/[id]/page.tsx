import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import ServisListesi from "@/app/components/ServisListesi"

const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

async function getMakineDetay(id: string) {
  return client.fetch(`
    *[_type == "makine" && _id == $id][0] {
      _id,
      baslik,
      seriNo,
      model,
      satinAlmaTarihi,
      garantiSuresi,
      "firmaId": firma._ref,
      "gorsel": anaGorsel.asset->url,
      "servisGecmisi": *[_type == "servisKaydi" && makine._ref == ^._id] | order(tarih desc) {
        _id,
        tarih,
        teknisyen,
        islemTuru,
        islemYeri,
        aciklama,
        notlar,
        cozum,
        degisenParcalar,
        "fotograflar": fotograflar[].asset->url
      }
    }
  `, { id })
}

export default async function MakineDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('/giris')

  const makine = await getMakineDetay(id)

  if (!makine) notFound()

  // Güvenlik: Kullanıcı sadece kendi firmasının makinesini görebilir
  // (Admin yetkisi varsa hepsini görebilir mantığı eklenebilir)
  if (session.user.yetki !== 'admin' && makine.firmaId !== session.user.firmaId) {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Yetkisiz Erişim</h1>
            <p className="text-gray-600 mt-2">Bu makinenin bilgilerini görüntüleme yetkiniz yok.</p>
            <Link href="/panel" className="mt-4 inline-block text-blue-600 hover:underline">Panele Dön</Link>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 h-64 md:h-auto bg-gray-100 relative">
            {makine.gorsel ? (
                <img src={makine.gorsel} alt={makine.baslik?.tr} className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Görsel Yok</div>
            )}
        </div>
        <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{makine.baslik?.tr || makine.model}</h1>
                    <p className="text-xl text-blue-600 font-mono mt-1">{makine.seriNo || 'Seri No Girilmemiş'}</p>
                </div>
                {/* Yeni Kayıt Ekle ve Düzenle Butonları (Sadece Admin) */}
                {session.user.yetki === 'admin' && (
                    <div className="flex gap-2">
                        <Link 
                            href={`/panel/admin/makine-duzenle/${makine._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            <span>Düzenle</span>
                        </Link>
                        <Link 
                            href={`/panel/makine/${makine._id}/ekle`}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2"
                        >
                            <span>+ Servis Kaydı</span>
                        </Link>
                    </div>
                )}
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Model</span>
                    <span className="text-gray-800 font-medium">{makine.model || '-'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Satın Alma Tarihi</span>
                    <span className="text-gray-800 font-medium">
                        {makine.satinAlmaTarihi 
                            ? new Date(makine.satinAlmaTarihi).toLocaleDateString('tr-TR') 
                            : '-'}
                    </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Garanti Durumu</span>
                    <span className={`font-bold ${
                        !makine.satinAlmaTarihi ? 'text-gray-500' :
                        new Date(new Date(makine.satinAlmaTarihi).setMonth(new Date(makine.satinAlmaTarihi).getMonth() + (makine.garantiSuresi || 12))) > new Date()
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                        {makine.satinAlmaTarihi ? (
                            new Date(new Date(makine.satinAlmaTarihi).setMonth(new Date(makine.satinAlmaTarihi).getMonth() + (makine.garantiSuresi || 12))) > new Date()
                            ? 'Devam Ediyor' 
                            : 'Sona Erdi'
                        ) : 'Belirtilmedi'}
                    </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Servis Kaydı</span>
                    <span className="text-gray-800 font-medium">{makine.servisGecmisi?.length || 0} Adet</span>
                </div>
            </div>
        </div>
      </div>

      {/* Servis Geçmişi (Timeline) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Makine Karnesi (Servis Geçmişi)</h2>
        
        {/* Yeni Client Component */}
        <ServisListesi 
            servisGecmisi={makine.servisGecmisi} 
            isAdmin={session.user.yetki === 'admin'} 
        />
      </div>
    </div>
  )
}
