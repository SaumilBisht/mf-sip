"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function KycPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
          { withCredentials: true }
        )
        const data = res.data
        if (data.currentStep < 2) router.push("/mobile")
        else if (data.currentStep > 2) router.push("/personal")
      } catch (err) {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [router])

  if (loading) return <div>Loading...</div>

  return <h1>KYC PAGE</h1>
}
