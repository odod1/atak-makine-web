import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { redirect } from "next/navigation"
import Link from "next/link"
import QRCodeCard from "./QRCodeCard"

const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

export default async function QRGeneratorPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/giris')
  }

  // Sorguyu yetkiye göre ayarla
  let query = ''
  let params = {}

  if (session.user.yetki === 'admin') {
    // Admin: Sadece bir firmaya atanmış (satılmış) makineleri görür
    query = `*[_type == "makine" && defined(firma)] {
      _id,
      baslik,
      seriNo,
      model,
      "firmaAdi": firma->ad
    } | order(baslik.tr asc)`
  } else {
    // Normal kullanıcı sadece kendi firmasını görür
    query = `*[_type == "makine" && firma._ref == $firmaId] {
      _id,
      baslik,
      seriNo,
      model,
      "firmaAdi": firma->ad
    } | order(baslik.tr asc)`
    params = { firmaId: session.user.firmaId }
  }

  const makineler = await client.fetch(query, params)

  // Production URL'ini öncelikli kullan, yoksa env variable, o da yoksa localhost
  const productionUrl = 'https://www.atakmakineuz.com'
  const baseUrl = process.env.NEXTAUTH_URL?.includes('localhost') 
    ? productionUrl 
    : (process.env.NEXTAUTH_URL || productionUrl)

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QR Kod Oluşturma Merkezi</h1>
          <p className="text-gray-600 mt-1">
            Kayıtlı makinelerin QR kodlarını buradan yönetebilirsiniz.
          </p>
        </div>
        
        {session.user.yetki === 'admin' && (
          <Link
            href="/panel/admin/makine-ekle"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Makine Ekle
          </Link>
        )}
      </div>

      <p className="mb-8 text-gray-600 print:hidden">
        Aşağıdaki listeden makinelerin QR kodlarını görebilirsiniz. 
        "Kopyala" butonu ile resmi panoya alabilir veya "İndir" ile kaydedebilirsiniz.
      </p>

      {makineler.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded text-yellow-800">
            Firmanıza kayıtlı makine bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
            {makineler.map((makine: any) => {
              const targetUrl = `${baseUrl}/panel/makine/${makine._id}`
              return (
                 <QRCodeCard 
                    key={makine._id} 
                    makine={makine} 
                    targetUrl={targetUrl} 
                 />
              )
            })}
        </div>
      )}
    </div>
  )
}
