"use client"

import Image from "next/image"
import arsLogo from "../../public/arsenal_logo.png"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-red-500/10 blur-xl animate-pulse" />
            <Image
              src={arsLogo}
              alt="Arsenal"
              width={96}
              height={96}
              className="animate-pulse"
              priority
            />
          </div>
          <p className="text-sm text-slate-600 animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  )
}
