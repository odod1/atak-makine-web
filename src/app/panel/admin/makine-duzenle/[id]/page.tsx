import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { notFound, redirect } from "next/navigation"
import MakineDuzenleClient from "./MakineDuzenleClient"

const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

export default async function MakineDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('/giris')
  if (session.user.yetki !== 'admin') return <div className="p-8 text-red-600">Yetkisiz Alan</div>

  // Makineyi çek
  const makine = await client.fetch(`
    *[_type == "makine" && _id == $id][0] {
      _id,
      baslik,
      seriNo,
      model,
      yil,
      durum,
      "firmaId": firma._ref,
      aciklama
    }
  `, { id })

  if (!makine) notFound()

  // Firmaları çek
  const firmalar = await client.fetch(`*[_type == "firma"] { _id, ad } | order(ad asc)`)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Makine Düzenle</h1>
        <p className="text-gray-600">
          Makine bilgilerini veya sahibini (firmasını) buradan değiştirebilirsiniz.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <MakineDuzenleClient makine={makine} firmalar={firmalar} />
      </div>
    </div>
  )
}

