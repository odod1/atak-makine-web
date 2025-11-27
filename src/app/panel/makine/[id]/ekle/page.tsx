'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function YeniServisEklePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('') // Hata mesajı için state
  const [formData, setFormData] = useState({
    teknisyen: '',
    islemTuru: 'ariza',
    islemYeri: 'yerinde',
    aciklama: '',
    notlar: '',
    cozum: '',
    degisenParcalar: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('') // Önceki hatayı temizle

    try {
      const res = await fetch('/api/servis-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          makineId: params.id,
          ...formData
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        alert('Servis kaydı başarıyla oluşturuldu.')
        router.push(`/panel/makine/${params.id}`)
        router.refresh()
      } else {
        // Sunucudan gelen gerçek hatayı göster
        setErrorMsg(data.error || 'Bilinmeyen bir hata oluştu.')
        alert(data.error || 'Bir hata oluştu.')
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('Sunucuya bağlanılamadı.')
      alert('Bağlantı hatası.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Servis Kaydı Oluştur</h1>
        <Link href={`/panel/makine/${params.id}`} className="text-sm text-gray-500 hover:underline">
            &larr; İptal ve Geri Dön
        </Link>
      </div>

      {/* Hata Mesajı Kutusu */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Hata:</strong> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form alanları aynı kalıyor */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Teknisyen / Yetkili Adı</label>
            <input 
                type="text" 
                required
                className="w-full border p-3 rounded focus:outline-blue-500"
                value={formData.teknisyen}
                onChange={e => setFormData({...formData, teknisyen: e.target.value})}
                placeholder="Örn: Ahmet Yılmaz"
            />
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">İşlem Türü</label>
            <select 
                className="w-full border p-3 rounded focus:outline-blue-500 bg-white"
                value={formData.islemTuru}
                onChange={e => setFormData({...formData, islemTuru: e.target.value})}
            >
                <option value="kurulum">Kurulum</option>
                <option value="bakim">Periyodik Bakım</option>
                <option value="ariza">Arıza Giderme</option>
                <option value="parca">Parça Değişimi</option>
                <option value="diger">Diğer</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">İşlem Yeri</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="islemYeri"
                        value="yerinde"
                        checked={formData.islemYeri === 'yerinde'}
                        onChange={e => setFormData({...formData, islemYeri: e.target.value})}
                        className="w-5 h-5 text-blue-600"
                    />
                    <span>Müşteri Adresinde (Yerinde)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="islemYeri"
                        value="atolye"
                        checked={formData.islemYeri === 'atolye'}
                        onChange={e => setFormData({...formData, islemYeri: e.target.value})}
                        className="w-5 h-5 text-blue-600"
                    />
                    <span>Atölyemizde</span>
                </label>
            </div>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">Arıza / İşlem Açıklaması</label>
            <textarea 
                className="w-full border p-3 rounded focus:outline-blue-500"
                rows={3}
                value={formData.aciklama}
                onChange={e => setFormData({...formData, aciklama: e.target.value})}
                placeholder="Sorun neydi veya ne işlem yapıldı?"
            ></textarea>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">Çözüm Yöntemi</label>
            <textarea 
                className="w-full border p-3 rounded focus:outline-blue-500"
                rows={3}
                value={formData.cozum}
                onChange={e => setFormData({...formData, cozum: e.target.value})}
                placeholder="Sorun nasıl giderildi?"
            ></textarea>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">Özel Notlar (Müşteriye Görünmez)</label>
            <textarea 
                className="w-full border p-3 rounded focus:outline-yellow-500 bg-yellow-50"
                rows={2}
                value={formData.notlar}
                onChange={e => setFormData({...formData, notlar: e.target.value})}
                placeholder="Ekstra teknik notlar..."
            ></textarea>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">Değişen Parçalar (Virgül ile ayırın)</label>
            <input 
                type="text" 
                className="w-full border p-3 rounded focus:outline-blue-500"
                value={formData.degisenParcalar}
                onChange={e => setFormData({...formData, degisenParcalar: e.target.value})}
                placeholder="Örn: İğne Mili, Çağanoz, Kayış"
            />
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded transition ${loading ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-800'}`}
        >
            {loading ? 'Kaydediliyor...' : 'Kaydı Oluştur'}
        </button>
      </form>
    </div>
  )
}
