import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      firmaId?: string
      firmaAdi?: string
      yetki?: string
    } & DefaultSession["user"]
  }

  interface User {
    firmaId?: string
    firmaAdi?: string
    yetki?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firmaId?: string
    firmaAdi?: string
    yetki?: string
  }
}



