"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-slate-900/60 border-b border-slate-800/50 supports-[backdrop-filter]:bg-slate-900/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              ResumeAI
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="/#features" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Testimonials
          </Link>
          {pathname !== "/render-cv" && (
            <Link
              href="/render-cv"
              className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white hover:opacity-90 transition-opacity"
            >
              AI Resume Builder
            </Link>
          )}
        </nav>
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  )
} 