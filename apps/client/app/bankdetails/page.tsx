import axios from "axios"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function BankDetailsPage() {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/dashboard")

  const { data } = await axios.get(`${process.env.BACKEND_URL}/user/status`, {
    withCredentials: true,
  })

  if (data.currentStep < 5) redirect("/finance")
  if (data.currentStep > 5) redirect("/dashboard")

  return <div>Bank Details / UPI Verification Page</div>
}
