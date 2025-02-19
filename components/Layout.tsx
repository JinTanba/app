"use client"

import type React from "react"
import Header from "./Header"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div
      className="min-h-screen flex flex-col bg-[#1E1E1E] bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-02-20%200.47.16-oqDTzvoVH1pr9lWpw6acl3NtaySHA4.png")',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-xl"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-start justify-center py-16 px-4"
          >
            <div className="w-full max-w-[1145px]">{children}</div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Layout

