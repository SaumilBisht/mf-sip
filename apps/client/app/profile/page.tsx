import { auth,signIn,signOut  } from "@/auth"

export default async function SignIn() {
  const session = await auth();
  console.log(session);
  const user=session?.user;

  return user?
  (
    <>
      <h1 className="text-2xl">Welcome {user.name}</h1>
      <h1 className="text-2xl">I see your email is {user.email}</h1>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button className="p-2 border-2 ">Sign Out</button>
      </form>
    </>
    
  ):
  (
    <>
      <h1>Youre not Authenticated. Sign In Below </h1>
      <form action={async () => {
          "use server"
          await signIn("google",{redirectTo:"/secret"})
        }}>
        <button type="submit" className="bg-blue-400 p-2 border-2">Sign IN</button>
      </form>
    </>
  )
} 