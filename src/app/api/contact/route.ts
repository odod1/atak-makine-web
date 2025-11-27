import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adSoyad, firma, telefon, email, mesaj } = body

    // Gerekli alanları kontrol et
    if (!adSoyad || !telefon || !mesaj) {
      return NextResponse.json(
        { error: 'Ad Soyad, telefon ve mesaj alanları zorunludur.' },
        { status: 400 }
      )
    }

    // Form verilerini konsola yazdır (geliştirme amaçlı)
    console.log('=== YENİ İLETİŞİM FORMU MESAJI ===')
    console.log('Tarih:', new Date().toLocaleString('tr-TR'))
    console.log('Ad Soyad:', adSoyad)
    console.log('Firma:', firma || 'Belirtilmemiş')
    console.log('Telefon:', telefon)
    console.log('E-posta:', email || 'Belirtilmemiş')
    console.log('Mesaj:', mesaj)
    console.log('=====================================')

    // SMTP ayarları varsa e-posta gönder
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const port = Number(process.env.SMTP_PORT) || 465
        const host = process.env.SMTP_HOST || 'smtpout.secureserver.net'
        
        const transporter = nodemailer.createTransport({
          host: host,
          port: port,
          secure: port === 465, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        })

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.SMTP_TO || process.env.SMTP_USER,
          subject: `Yeni İletişim Formu Mesajı - ${adSoyad}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                Yeni İletişim Formu Mesajı
              </h2>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Ad Soyad:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${adSoyad}</td>
                  </tr>
                  ${firma ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Firma:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${firma}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefon:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${telefon}</td>
                  </tr>
                  ${email ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-posta:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${email}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">Mesaj:</h3>
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; white-space: pre-line;">
${mesaj}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                <p>Bu mesaj atakmakine.uz web sitesindeki iletişim formundan gönderilmiştir.</p>
                <p>Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}</p>
              </div>
            </div>
          `,
        }

        await transporter.sendMail(mailOptions)
        console.log('E-posta başarıyla gönderildi!')
      } catch (emailError) {
        console.error('E-posta gönderme hatası:', emailError)
        // E-posta hatası olsa da form mesajını başarılı say
      }
    } else {
      console.log('SMTP ayarları bulunamadı, sadece konsola yazdırıldı.')
    }

    // Başarılı yanıt
    return NextResponse.json(
      { message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('İletişim formu hatası:', error)
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
