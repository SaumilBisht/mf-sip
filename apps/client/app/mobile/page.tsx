import axios from "axios"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function MobilePage() {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/dashboard")

  const { data } = await axios.get(`${process.env.BACKEND_URL}/user/status`, {
    withCredentials: true,
  })
  if (data.currentStep < 1) redirect("/dashboard")
  if (data.currentStep > 1) redirect("/kyc")

  return (
    <div>
      <h1>Mobile Verification (OTP)</h1>
    </div>
  )
}
