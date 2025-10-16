import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { auth } from "@/auth";

export const metadata = {
  title: "Fineasy",
  description: "Finance made simple",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers session={session}>
          <Header />
          <main className="flex-1 mt-[64px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
