import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "OASIS Protocol - The Ultimate Buildathon",
  description: "Crack the layers of security, rebuild the platform, and restore the OASIS to its former glory.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              color: "#00ffff",
              border: "1px solid rgba(0, 255, 255, 0.3)",
            },
          }}
        />
      </body>
    </html>
  )
}
