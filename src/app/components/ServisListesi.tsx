'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function ServisListesi({ servisGecmisi, isAdmin }: { servisGecmisi: any[], isAdmin: boolean }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Bu servis kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/servis/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Kayıt silindi.')
        router.refresh()
      } else {
        alert('Silinirken bir hata oluştu.')
      }
    } catch (error) {
      console.error(error)
      alert('Bağlantı hatası.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!servisGecmisi || servisGecmisi.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center text-gray-500">
        Henüz kayıtlı servis işlemi bulunmuyor.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {servisGecmisi.map((kayit: any) => (
        <div key={kayit._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 relative group">
            {/* Düzenle/Sil Butonları (Sadece Admin Görebilir) */}
            {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                        href={`/panel/servis/${kayit._id}/duzenle`}
                        className="p-2 bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full shadow-sm"
                        title="Düzenle"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </Link>
                    <button 
                        onClick={() => handleDelete(kayit._id)}
                        disabled={isDeleting}
                        className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-full shadow-sm"
                        title="Sil"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pr-20">
            <div>
              <span className="text-sm text-gray-500 font-medium">
                {new Date(kayit.tarih).toLocaleDateString('tr-TR', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {kayit.islemTuru === 'ariza' ? 'Arıza Giderme' :
                 kayit.islemTuru === 'bakim' ? 'Periyodik Bakım' :
                 kayit.islemTuru === 'kurulum' ? 'Kurulum' :
                 kayit.islemTuru === 'parca' ? 'Parça Değişimi' : 'Diğer İşlem'}
              </h3>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-3">
                {/* İşlem Yeri Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                    kayit.islemYeri === 'yerinde' 
                    ? 'bg-orange-50 text-orange-700 border-orange-100' 
                    : 'bg-purple-50 text-purple-700 border-purple-100'
                }`}>
                    {kayit.islemYeri === 'yerinde' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a.75.75 0 01.75.75v.5c0 .414.336.75.75.75h2.5a.75.75 0 01.75-.75v-.5a.75.75 0 01.75-.75h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z" />
                            </svg>
                            Yerinde Servis
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                            Atölyede
                        </>
                    )}
                </span>

                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <span className="text-xs text-blue-600 font-bold uppercase">Teknisyen:</span>
                    <span className="text-sm text-blue-800">{kayit.teknisyen}</span>
                </div>
            </div>
          </div>

          <div className="space-y-3">
            {kayit.aciklama && (
              <div>
                <h4 className="text-sm font-bold text-gray-700">Açıklama:</h4>
                <p className="text-gray-600 text-sm">{kayit.aciklama}</p>
              </div>
            )}

            {kayit.cozum && (
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <h4 className="text-sm font-bold text-green-800">Çözüm / Yapılan İşlem:</h4>
                <p className="text-green-700 text-sm">{kayit.cozum}</p>
              </div>
            )}

            {kayit.degisenParcalar && kayit.degisenParcalar.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-1">Değişen Parçalar:</h4>
                <div className="flex flex-wrap gap-2">
                  {kayit.degisenParcalar.map((parca: string, i: number) => (
                    <span key={i} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded border border-orange-200">
                      {parca}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {kayit.notlar && (
                <div className="bg-yellow-50 p-3 rounded border border-yellow-100 mt-2">
                    <h4 className="text-xs font-bold text-yellow-800 uppercase mb-1">Özel Notlar:</h4>
                    <p className="text-yellow-700 text-sm">{kayit.notlar}</p>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

