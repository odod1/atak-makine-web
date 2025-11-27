import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { NextResponse } from "next/server"

// Sanity İstemcisi (Token ile)
const getClient = () => {
  const token = "skYKiRSOlSeJYgu5h4KyPBORgDoyEbojbdsTiejKws0nLzXxHfyzlBk2dz1o9R5GxUPsJJNsaTZtnj0FJ1AltKo1NMYkQlMdt4QMwEA1NY81cTZLB658UAary0kzOUXqXCJSmw5898Lpu5f2VE4541ZuKKTXFO1rPEOyo4Kt3x2kfkiB6bmv"
  
  // Debug için log (Production'da kaldırılabilir)
  console.log("API Token Durumu (Düzenle/Sil):", token ? "Mevcut" : "YOK!")

  if (!token) {
    throw new Error("API Token bulunamadı. Lütfen .env dosyasını kontrol edin.")
  }

  return createClient({
    projectId: "bgx5fxe4",
    dataset: "production",
    useCdn: false,
    token: token,
    apiVersion: "2024-01-01",
  })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 })

  if (session.user.yetki !== 'admin') {
    return NextResponse.json({ error: "Yetkisiz işlem (Sadece Admin)" }, { status: 403 })
  }

  const { id } = await params

  try {
    const client = getClient()
    await client.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Silme hatası:", error)
    return NextResponse.json({ error: `Silinemedi: ${error.message}` }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 })

  if (session.user.yetki !== 'admin') {
    return NextResponse.json({ error: "Yetkisiz işlem (Sadece Admin)" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  try {
    const client = getClient()
    const { teknisyen, islemTuru, islemYeri, aciklama, cozum, degisenParcalar, notlar } = body

    await client
      .patch(id)
      .set({
        teknisyen,
        islemTuru,
        islemYeri,
        aciklama,
        cozum,
        degisenParcalar: degisenParcalar ? degisenParcalar.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
        notlar
      })
      .commit()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Güncelleme hatası:", error)
    return NextResponse.json({ error: `Güncellenemedi: ${error.message}` }, { status: 500 })
  }
}
