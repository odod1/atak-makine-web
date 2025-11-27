import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "next-sanity"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 })
  }

  // Sadece Adminler ekleyebilir
  if (session.user.yetki !== 'admin') {
    return NextResponse.json({ error: "Bu işlemi yapmak için yetkiniz yok (Sadece Admin)." }, { status: 403 })
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
    const { baslik, model, seriNo, yil, durum, firmaId, notlar } = body

    if (!baslik || !model || !seriNo || !firmaId) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları (Başlık, Model, Seri No, Firma) doldurun." }, { status: 400 })
    }

    // slug oluştur (basitçe)
    const slug = (baslik + '-' + seriNo).toLowerCase()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')

    const doc = {
      _type: 'makine',
      baslik: { tr: baslik }, // Çok dilli başlık yapısına uygun
      model,
      seriNo,
      slug: { current: slug },
      yil: parseInt(yil) || new Date().getFullYear(),
      durum: durum || 'ikinciEl', // sifir veya ikinciEl
      sitedeGoster: false, // Varsayılan olarak sitede gösterme (sadece panelde görünsün)
      firma: {
        _type: 'reference',
        _ref: firmaId
      },
      aciklama: notlar ? { tr: [{ _type: 'block', children: [{ _type: 'span', text: notlar }] }] } : undefined
    }

    console.log("Sanity'ye makine kaydı deneniyor...", doc)
    const result = await client.create(doc)
    console.log("Sanity makine kayıt başarılı:", result._id)

    return NextResponse.json({ success: true, id: result._id })
  } catch (error: any) {
    console.error("Makine ekleme hatası:", error)
    return NextResponse.json({ 
        error: `Kayıt Başarısız: ${error.message || JSON.stringify(error)}` 
    }, { status: 500 })
  }
}

