'use client'

import { useState } from 'react'

interface QRCodeCardProps {
  makine: {
    _id: string
    baslik: { tr?: string } | null
    model: string | null
    seriNo: string | null
    firmaAdi: string | null
  }
  targetUrl: string
}

export default function QRCodeCard({ makine, targetUrl }: QRCodeCardProps) {
  const [copyStatus, setCopyStatus] = useState('')
  
  // Daha kaliteli çıktı için 500x500 boyutunda ve kenar boşluklu oluşturuyoruz
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&data=${encodeURIComponent(targetUrl)}`

  const handleCopyImage = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      // Görseli panoya kopyala
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyStatus('Kopyalandı! ✅')
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (err) {
      console.error('Kopyalama hatası:', err)
      setCopyStatus('Hata!')
      alert('Görsel kopyalanamadı. Lütfen görsele sağ tıklayıp "Resmi Kopyala" deyin.')
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Dosya adı: Model-SeriNo.png
      a.download = `QR-${(makine.model || 'makine').replace(/\s+/g, '-')}-${makine.seriNo || 'seri'}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('İndirme hatası:', err)
    }
  }

  return (
    <div className="border p-6 rounded-lg flex flex-col items-center text-center bg-white shadow-sm break-inside-avoid hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg mb-1 text-gray-800">{makine.baslik?.tr || makine.model || 'İsimsiz Makine'}</h3>
      <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-100 px-2 py-1 rounded">Seri: {makine.seriNo || '-'}</p>
      
      <div className="bg-white p-2 border rounded mb-4">
        {/* Ekranda makul boyutta görünsün ama indirince büyük olsun */}
        <img 
          src={qrImageUrl} 
          alt="QR Kod"
          className="w-48 h-48 object-contain"
        />
      </div>
      
      {makine.firmaAdi && (
         <span className="mb-4 inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-100">
            {makine.firmaAdi}
         </span>
      )}

      <div className="flex gap-2 w-full print:hidden">
        <button 
            onClick={handleCopyImage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition flex justify-center items-center gap-2 font-medium shadow-sm"
        >
            {copyStatus || (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                    Kopyala
                </>
            )}
        </button>
        <button 
            onClick={handleDownload}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded transition flex justify-center items-center gap-2 border border-gray-200"
            title="Bilgisayara İndir"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            İndir
        </button>
      </div>
      <p className="text-[10px] text-gray-300 font-mono mt-3 select-all">{makine._id}</p>
    </div>
  )
}



