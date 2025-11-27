'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MakineEkleClient({ firmalar }: { firmalar: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      baslik: formData.get('baslik'),
      model: formData.get('model'),
      seriNo: formData.get('seriNo'),
      yil: formData.get('yil'),
      durum: formData.get('durum'),
      firmaId: formData.get('firmaId'),
      notlar: formData.get('notlar'),
    }

    try {
      const res = await fetch('/api/makine-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Bir hata oluştu')
      }

      // Başarılı, QR sayfasına yönlendir
      router.push('/panel/admin/qr-kodlar')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Makine Başlığı *</label>
          <input
            name="baslik"
            required
            placeholder="Örn: Durkopp Adler 867"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Model Kodu *</label>
          <input
            name="model"
            required
            placeholder="Örn: 867-190122"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Seri Numarası *</label>
          <input
            name="seriNo"
            required
            placeholder="Örn: 123456789"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Üretim Yılı</label>
          <input
            name="yil"
            type="number"
            defaultValue={new Date().getFullYear()}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Durum</label>
          <select
            name="durum"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="sifir">Sıfır</option>
            <option value="ikinciEl">İkinci El</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Firma (Müşteri) *</label>
          <select
            name="firmaId"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Seçiniz...</option>
            {firmalar.map((f) => (
              <option key={f._id} value={f._id}>
                {f.ad}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Notlar</label>
        <textarea
          name="notlar"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
          placeholder="Makine hakkında ek bilgiler..."
        />
      </div>

      <div className="pt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm transition transform active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve QR Oluştur'}
        </button>
      </div>
    </form>
  )
}

