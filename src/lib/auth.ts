import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "next-sanity"

// Sanity İstemcisi
const client = createClient({
  projectId: "bgx5fxe4",
  dataset: "production",
  useCdn: false, // Giriş işlemleri için güncel veri şart
  apiVersion: "2024-01-01",
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // Kullanıcıyı Sanity'den bul
        const user = await client.fetch(
          `*[_type == "musteriKullanicisi" && kullaniciAdi == $username][0]{
            _id,
            kullaniciAdi,
            sifre,
            yetki,
            "firmaId": firma._ref,
            "firmaAdi": firma->ad
          }`,
          { username: credentials.username }
        )

        // Şifre kontrolü (Basit metin olarak)
        if (user && user.sifre === credentials.password) {
          return {
            id: user._id,
            name: user.kullaniciAdi,
            email: user.kullaniciAdi, 
            firmaId: user.firmaId,
            firmaAdi: user.firmaAdi,
            yetki: user.yetki
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firmaId = user.firmaId
        token.firmaAdi = user.firmaAdi
        token.yetki = user.yetki
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.firmaId = token.firmaId as string
        session.user.firmaAdi = token.firmaAdi as string
        session.user.yetki = token.yetki as string
      }
      return session
    }
  },
  pages: {
    signIn: '/giris',
  },
  session: {
    strategy: "jwt",
  },
  secret: "gizli-anahtar-buraya-gelecek-env-dosyasindan-almali", 
}


