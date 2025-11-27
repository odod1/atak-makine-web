import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 })
  }

  if (session.user.yetki !== 'admin') {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 })
  }

  // Token (API'den kopyalandı)
  const token = "skYKiRSOlSeJYgu5h4KyPBORgDoyEbojbdsTiejKws0nLzXxHfyzlBk2dz1o9R5GxUPsJJNsaTZtnj0FJ1AltKo1NMYkQlMdt4QMwEA1NY81cTZLB658UAary0kzOUXqXCJSmw5898Lpu5f2VE4541ZuKKTXFO1rPEOyo4Kt3x2kfkiB6bmv"

  const client = createClient({
    projectId: "bgx5fxe4",
    dataset: "production",
    useCdn: false,
    token: token, 
    apiVersion: "2024-01-01",
  })

  try {
    const body = await request.json()
    const { id, baslik, model, seriNo, yil, durum, firmaId, notlar } = body

    if (!id) {
      return NextResponse.json({ error: "Makine ID eksik." }, { status: 400 })
    }

    const mutations = {
      baslik: { tr: baslik },
      model,
      seriNo,
      yil: parseInt(yil),
      durum,
      firma: { _type: 'reference', _ref: firmaId },
      aciklama: notlar ? { tr: [{ _type: 'block', children: [{ _type: 'span', text: notlar }] }] } : undefined
    }

    console.log("Makine güncelleniyor...", id, mutations)
    
    await client.patch(id).set(mutations).commit()
    
    console.log("Güncelleme başarılı!")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Makine güncelleme hatası:", error)
    return NextResponse.json({ 
        error: `Güncelleme Başarısız: ${error.message}` 
    }, { status: 500 })
  }
}

