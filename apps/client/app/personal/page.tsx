import axios from "axios"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function PersonalPage() {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/dashboard")

  const { data } = await axios.get(`${process.env.BACKEND_URL}/user/status`, {
    withCredentials: true,
  })

  if (data.currentStep < 3) redirect("/kyc")
  if (data.currentStep > 3) redirect("/finance")

  return <div>Personal Information Page</div>
}
