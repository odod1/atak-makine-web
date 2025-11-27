import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 })
  }

  // Sadece Adminler düzenleyebilir
  if (session.user.yetki !== 'admin') {
    return NextResponse.json({ error: "Bu işlemi yapmak için yetkiniz yok (Sadece Admin)." }, { status: 403 })
  }

  // Token (API'den kopyalandı - Write yetkili)
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
    const { id, firmaId, durum, notlar } = body

    if (!id || !firmaId) {
      return NextResponse.json({ error: "Makine ID ve Firma ID zorunludur." }, { status: 400 })
    }

    // Sanity'de güncelleme (patch) işlemi
    const patch = client.patch(id)
        .set({
            firma: {
                _type: 'reference',
                _ref: firmaId
            },
            durum: durum, // sifir veya ikinciEl
        })

    // Eğer notlar varsa güncelle, yoksa dokunma
    if (notlar !== undefined) {
        // Notları block content olarak güncellemek biraz karmaşık olabilir,
        // basitlik için şimdilik sadece firma ve durum güncelliyoruz.
        // Not güncellemesi gerekirse buraya eklenir.
    }

    const result = await patch.commit()
    console.log("Makine güncelleme başarılı:", result._id)

    return NextResponse.json({ success: true, id: result._id })
  } catch (error: any) {
    console.error("Makine güncelleme hatası:", error)
    return NextResponse.json({ 
        error: `Güncelleme Başarısız: ${error.message || JSON.stringify(error)}` 
    }, { status: 500 })
  }
}

