import "./globals.css"
import Header from "@/components/Header"
import { SessionProvider } from "next-auth/react"
export const metadata = {
  title: "Fineasy",
  description: "Finance made simple",
}

export default function RootLayout({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SessionProvider session={session}>
          <Header />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
