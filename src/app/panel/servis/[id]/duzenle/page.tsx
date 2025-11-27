'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// Client-side veri çekme için (Sadece okuma)
const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
})

export default function ServisDuzenlePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('') // Hata mesajı
  const [formData, setFormData] = useState({
    teknisyen: '',
    islemTuru: '',
    islemYeri: 'yerinde',
    aciklama: '',
    notlar: '',
    cozum: '',
    degisenParcalar: '',
    makineId: ''
  })

  useEffect(() => {
    // Mevcut veriyi çek
    const loadData = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "servisKaydi" && _id == $id][0] {
            teknisyen,
            islemTuru,
            islemYeri,
            aciklama,
            notlar,
            cozum,
            degisenParcalar,
            "makineId": makine._ref
          }
        `, { id: params.id })

        if (data) {
          setFormData({
            teknisyen: data.teknisyen || '',
            islemTuru: data.islemTuru || 'ariza',
            islemYeri: data.islemYeri || 'yerinde',
            aciklama: data.aciklama || '',
            notlar: data.notlar || '',
            cozum: data.cozum || '',
            degisenParcalar: data.degisenParcalar ? data.degisenParcalar.join(', ') : '',
            makineId: data.makineId
          })
        } else {
            alert('Kayıt bulunamadı')
            router.back()
        }
      } catch (error) {
        console.error(error)
        alert('Veri yüklenirken hata oluştu.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) loadData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/servis/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (res.ok && result.success) {
        alert('Servis kaydı güncellendi.')
        router.push(`/panel/makine/${formData.makineId}`)
        router.refresh()
      } else {
        // Sunucudan gelen hatayı göster
        const mesaj = result.error || 'Güncellenirken bir hata oluştu.'
        setErrorMsg(mesaj)
        // alert(mesaj) // İsterseniz alert'i kaldırabiliriz
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('Sunucuya bağlanılamadı.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Servis Kaydını Düzenle</h1>
        <Link href={`/panel/makine/${formData.makineId}`} className="text-sm text-gray-500 hover:underline">
            &larr; İptal
        </Link>
      </div>

      {/* Hata Kutusu */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Hata:</strong> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-gray-700 font-bold mb-2">Teknisyen / Yetkili Adı</label>
            <input 
                type="text" 
                required
                className="w-full border p-3 rounded focus:outline-blue-500"
                value={formData.teknisyen}
                onChange={e => setFormData({...formData, teknisyen: e.target.value})}
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
            ></textarea>
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">Çözüm Yöntemi</label>
            <textarea 
                className="w-full border p-3 rounded focus:outline-blue-500"
                rows={3}
                value={formData.cozum}
                onChange={e => setFormData({...formData, cozum: e.target.value})}
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
            />
        </div>

        <button 
            type="submit" 
            disabled={saving}
            className={`w-full text-white font-bold py-3 rounded transition ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  )
}
