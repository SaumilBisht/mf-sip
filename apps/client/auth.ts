import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {//@ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
