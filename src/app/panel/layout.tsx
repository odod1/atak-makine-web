import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/giris')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Üst Bar */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Sol: Logo ve Firma Adı */}
          <div className="flex items-center gap-6">
             <Link href="/panel" className="flex-shrink-0 transition hover:opacity-80">
                <Image
                  src="/logos/Atakmakinelogo.png"
                  alt="Atak Makine"
                  width={160}
                  height={50}
                  className="h-10 w-auto object-contain"
                  priority
                  unoptimized
                />
             </Link>
             
             {/* Dikey Çizgi ve Firma Adı */}
             <div className="hidden md:flex items-center gap-4 border-l pl-4 border-gray-300 h-10">
                <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">
                    Servis Paneli
                </span>
                <span className="text-blue-900 font-bold px-4 py-1.5 bg-blue-50 rounded-full text-sm border border-blue-100">
                    {session.user.firmaAdi}
                </span>
             </div>
          </div>

          {/* Sağ: Aksiyonlar ve Kullanıcı */}
          <div className="flex items-center gap-6">
             {/* QR Butonu (Header'a Taşındı) */}
             <Link 
                href="/panel/admin/qr-kodlar" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 text-sm font-bold transition transform hover:scale-105 active:scale-95"
                title="QR Kod Merkezi"
             >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8-1a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm-9 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-1a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">QR Kodlar</span>
             </Link>

             <div className="h-8 w-px bg-gray-200"></div>

             <div className="flex flex-col items-end text-right">
                <span className="text-gray-800 font-bold text-base leading-tight">
                    {session.user.name}
                </span>
                <Link 
                    href="/api/auth/signout" 
                    className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium mt-0.5"
                >
                    Güvenli Çıkış
                </Link>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Atak Makine. Tüm hakları saklıdır.
      </footer>
    </div>
  )
}
