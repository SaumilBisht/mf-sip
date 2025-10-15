"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import axios from "axios"

export default function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await axios.post(
        `${process.env.BACKEND_URL}/auth/sync`,
        { email: user.email, name: user.name },
        { withCredentials: true }
      )
      const { currentStep } = res.data
      if (currentStep === 1) router.push("/kyc")
      else if (currentStep === 2) router.push("/bank-link")
      else router.push("/dashboard")
    } catch (err) {
      console.error("Error syncing user:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    await signIn("google", { redirect: false })
    setTimeout(handleSync, 1000)
  }

  const handleSignOut = async () => {
    try {
      await axios.post(`${process.env.BACKEND_URL}/auth/signout`, {}, { withCredentials: true })
      await signOut({ redirect: false })
      router.refresh()
    } catch (err) {
      console.error("Signout failed:", err)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b z-50">
      <div
        onClick={() => router.push("/dashboard")}
        className="text-xl font-semibold text-blue-600 cursor-pointer hover:opacity-80"
      >
        Fineasy
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 text-sm">{user.name}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        )}
      </div>
    </header>
  )
}
