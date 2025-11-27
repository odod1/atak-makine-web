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

  // Token kontrolü
  const token = "skYKiRSOlSeJYgu5h4KyPBORgDoyEbojbdsTiejKws0nLzXxHfyzlBk2dz1o9R5GxUPsJJNsaTZtnj0FJ1AltKo1NMYkQlMdt4QMwEA1NY81cTZLB658UAary0kzOUXqXCJSmw5898Lpu5f2VE4541ZuKKTXFO1rPEOyo4Kt3x2kfkiB6bmv"
  
  // HATA AYIKLAMA İÇİN: Token var mı kontrol edelim (Güvenlik için logda tamamını göstermeyelim)
  console.log("API Token Durumu:", token ? `Mevcut (Uzunluk: ${token.length})` : "YOK!")

  if (!token) {
    return NextResponse.json({ 
        error: "Sunucu Hatası: Yazma yetkisi için API Token tanımlanmamış. Lütfen .env.local dosyasını kontrol edin." 
    }, { status: 500 })
  }

  const client = createClient({
    projectId: "bgx5fxe4",
    dataset: "production",
    useCdn: false,
    token: token, 
    apiVersion: "2024-01-01",
  })

  try {
    const body = await request.json()
    const { makineId, teknisyen, islemTuru, islemYeri, aciklama, cozum, degisenParcalar, notlar } = body

    if (!makineId || !teknisyen || !islemTuru) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları (Teknisyen, İşlem Türü) doldurun." }, { status: 400 })
    }

    const doc = {
      _type: 'servisKaydi',
      makine: {
        _type: 'reference',
        _ref: makineId
      },
      tarih: new Date().toISOString(),
      teknisyen,
      islemTuru,
      islemYeri: islemYeri || 'yerinde', // Varsayılan: Yerinde
      aciklama,
      cozum,
      degisenParcalar: degisenParcalar ? degisenParcalar.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      notlar
    }

    console.log("Sanity'ye kayıt deneniyor...", doc)
    const result = await client.create(doc)
    console.log("Sanity kayıt başarılı:", result._id)

    return NextResponse.json({ success: true, id: result._id })
  } catch (error: any) {
    console.error("Servis ekleme hatası (DETAYLI):", error)
    
    // Hata mesajını kullanıcıya gösterelim ki sorunu anlayalım
    return NextResponse.json({ 
        error: `Kayıt Başarısız: ${error.message || JSON.stringify(error)}` 
    }, { status: 500 })
  }
}
