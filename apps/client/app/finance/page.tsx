import axios from "axios"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function FinancePage() {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/dashboard")

  const { data } = await axios.get(`${process.env.BACKEND_URL}/user/status`, {
    withCredentials: true,
  })

  if (data.currentStep < 4) redirect("/personal")
  if (data.currentStep > 4) redirect("/bankdetails")

  return <div>Financial Information Page</div>
}
