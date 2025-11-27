import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adSoyad, firma, telefon, email, makine, adet, uygulama, sehir, not } = body

    const port = Number(process.env.SMTP_PORT) || 587
    
    // 1. SMTP Ayarları (Gönderici Hesabı)
    // Not: .env dosyasındaki hatalı host ayarlarını ezmek için hardcode yapıldı.
    const transporter = nodemailer.createTransport({
      host: 'mail.atakmakineuz.com',
      port: port,
      secure: port === 465, // 465 ise true, değilse false
      auth: {
        user: 'info@atakmakineuz.com',
        pass: process.env.SMTP_PASS, // Sadece şifreyi env'den al
      },
    })

    // 2. E-posta İçeriği
    const mailOptions = {
      from: `"Web Sitesi Teklif Formu" <${process.env.SMTP_USER || 'info@atakmakineuz.com'}>`,
      to: process.env.SMTP_TO || 'info@atakmakineuz.com', // Alıcı (Sizin mailiniz)
      subject: `Yeni Teklif İsteği: ${firma} - ${adSoyad}`,
      html: `
        <h2>Yeni Teklif İsteği Geldi</h2>
        <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        <hr />
        <h3>İletişim Bilgileri</h3>
        <ul>
          <li><strong>Ad Soyad:</strong> ${adSoyad}</li>
          <li><strong>Firma:</strong> ${firma}</li>
          <li><strong>Telefon:</strong> ${telefon}</li>
          <li><strong>E-posta:</strong> ${email || '-'}</li>
          <li><strong>Şehir:</strong> ${sehir || '-'}</li>
        </ul>
        <hr />
        <h3>Talep Detayları</h3>
        <ul>
          <li><strong>İlgilenilen Makine:</strong> ${makine || '-'}</li>
          <li><strong>Adet:</strong> ${adet || '-'}</li>
          <li><strong>Uygulama/Kumaş:</strong> ${uygulama || '-'}</li>
        </ul>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <strong>Notlar:</strong><br/>
          ${not || '-'}
        </div>
      `,
    }

    // 3. Gönder
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: 'Teklif talebiniz başarıyla alındı.' })
  } catch (error: any) {
    console.error('Mail gönderme hatası:', error)
    return NextResponse.json({ error: 'Gönderim başarısız oldu.' }, { status: 500 })
  }
}

