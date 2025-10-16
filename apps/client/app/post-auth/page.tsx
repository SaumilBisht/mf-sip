"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function PostAuthPage() 
{
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const sync = async () => {
      if (!session?.user) return
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sync`,
          { email: session.user.email, name: session.user.name },
          { withCredentials: true }
        )
        const { currentStep } = res.data
        if (currentStep === 1) router.push("/mobile")
        else if (currentStep === 2) router.push("/kyc")
        else if (currentStep === 3) router.push("/personal")
        else if (currentStep === 4) router.push("/finance")
        else if (currentStep === 5) router.push("/bankdetails")
        else router.push("/dashboard")
      } catch (err) {
        console.error("Sync error:", err)
      }
    }

    sync()
  }, [session])

  return <div className="m-6 text-3xl">Syncing your account...</div>
}
