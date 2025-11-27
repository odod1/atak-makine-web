import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { redirect } from "next/navigation"
import MakineEkleClient from "./MakineEkleClient"

const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

export default async function MakineEklePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/giris')
  }

  if (session.user.yetki !== 'admin') {
    return (
      <div className="text-center py-12 text-red-600">
        Bu sayfaya erişim yetkiniz yok.
      </div>
    )
  }

  // Firmaları çek
  const firmalar = await client.fetch(`*[_type == "firma"] { _id, ad } | order(ad asc)`)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Makine Ekle</h1>
        <p className="text-gray-600">
          Sisteme yeni bir makine kaydedin ve QR kodunu oluşturun.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <MakineEkleClient firmalar={firmalar} />
      </div>
    </div>
  )
}

