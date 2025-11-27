'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MakineDuzenleClient({ makine, firmalar }: { makine: any, firmalar: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Açıklama metnini al
  const aciklamaText = makine.aciklama?.tr?.[0]?.children?.[0]?.text || ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      id: makine._id,
      baslik: formData.get('baslik'),
      model: formData.get('model'),
      seriNo: formData.get('seriNo'),
      yil: formData.get('yil'),
      durum: formData.get('durum'),
      firmaId: formData.get('firmaId'),
      notlar: formData.get('notlar'),
    }

    try {
      const res = await fetch('/api/makine-guncelle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Hata oluştu')

      // Başarılı
      router.push(`/panel/makine/${makine._id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Makine Başlığı</label>
          <input
            name="baslik"
            defaultValue={makine.baslik?.tr}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            name="model"
            defaultValue={makine.model}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Seri No</label>
          <input
            name="seriNo"
            defaultValue={makine.seriNo}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Yıl</label>
          <input
            name="yil"
            type="number"
            defaultValue={makine.yil}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Firma (Sahibi)</label>
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 mb-2">
            Dikkat: Firmayı değiştirdiğinizde, makine o firmanın paneline taşınır.
          </div>
          <select
            name="firmaId"
            defaultValue={makine.firmaId}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-bold text-blue-700"
          >
            {firmalar.map((f) => (
              <option key={f._id} value={f._id}>
                {f.ad}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Durum</label>
          <select
            name="durum"
            defaultValue={makine.durum}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="sifir">Sıfır</option>
            <option value="ikinciEl">İkinci El</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Notlar</label>
        <textarea
          name="notlar"
          defaultValue={aciklamaText}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      <div className="pt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
        >
          {isSubmitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  )
}

