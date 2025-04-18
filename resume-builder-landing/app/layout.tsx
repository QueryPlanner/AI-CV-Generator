import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ResumeAI - AI-Powered Resume Builder",
  description:
    "Automatically generate tailored resumes based on job descriptions. Increase your interview chances by 3x.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'