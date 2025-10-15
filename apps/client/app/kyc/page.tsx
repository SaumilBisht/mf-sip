import axios from "axios"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function KycPage() {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/dashboard")

  const { data } = await axios.get(`${process.env.BACKEND_URL}/user/status`, {
    withCredentials: true,
  })

  if (data.currentStep < 2) redirect("/mobile")
  if (data.currentStep > 2) redirect("/personal")

  return <div>KYC Verification Page (PAN + DOB)</div>
}
