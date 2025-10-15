import { auth } from "@/auth";
import {redirect} from "next/navigation"
export default async function Secret() {
  const session=await auth();
  if(!session) return redirect("/profile n")

  return(
    <div className="text-2xl text-green-600">
      Welcome to the secret, Youre Authenticated
    </div>
  )
}