import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import Link from "next/link"

const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

async function getFirmMakineleri(session: any) {
  // Admin ise tüm makineleri görsün
  if (session.user.yetki === 'admin') {
    return client.fetch(`
      *[_type == "makine" && defined(seriNo) && seriNo != ""] {
        _id,
        baslik,
        model,
        seriNo,
        "firmaAdi": firma->ad,
        "gorsel": anaGorsel.asset->url,
        "sonServisTarihi": *[_type == "servisKaydi" && makine._ref == ^._id] | order(tarih desc)[0].tarih
      }
    `)
  }

  // Değilse sadece kendi firmasını görsün
  return client.fetch(`
    *[_type == "makine" && firma._ref == $firmaId && defined(seriNo) && seriNo != ""] {
      _id,
      baslik,
      model,
      seriNo,
      "gorsel": anaGorsel.asset->url,
      "sonServisTarihi": *[_type == "servisKaydi" && makine._ref == ^._id] | order(tarih desc)[0].tarih
    }
  `, { firmaId: session.user.firmaId })
}

export default async function PanelPage() {
  const session = await getServerSession(authOptions)
  if (!session) return <div>Yetkisiz Erişim</div>

  const makineler = await getFirmMakineleri(session)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Makinelerim</h1>
      </div>
      
      {makineler.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded text-yellow-800">
            Firmanıza kayıtlı makine bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {makineler.map((makine: any) => (
            <Link key={makine._id} href={`/panel/makine/${makine._id}`} className="block group">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-200">
                <div className="h-48 bg-gray-200 relative">
                  {makine.gorsel ? (
                    <img src={makine.gorsel} alt={makine.baslik?.tr || 'Makine'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Görsel Yok</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600">
                    {makine.baslik?.tr || makine.model || 'İsimsiz Makine'}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p><strong>Seri No:</strong> {makine.seriNo || 'Belirtilmemiş'}</p>
                    {/* Admin ise makinenin hangi firmaya ait olduğunu da gösterelim */}
                    {session.user.yetki === 'admin' && makine.firmaAdi && (
                        <p className="text-purple-700"><strong>Firma:</strong> {makine.firmaAdi}</p>
                    )}
                    <p>
                        <strong>Son Servis:</strong> 
                        {makine.sonServisTarihi 
                            ? new Date(makine.sonServisTarihi).toLocaleDateString('tr-TR') 
                            : 'Kayıt Yok'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

