// app/components/navbar.tsx
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import logoImg from "../../../public/cannon.png"

interface NavLinkProps {
  children: ReactNode
  href: string
}

const NavLink = ({ children, href }: NavLinkProps) => { 
  const pathname = usePathname()

  // Determine if this link is active
  const isActive = href === '/' 
    ? pathname === '/' 
    : pathname.startsWith(href)

  return (
    <Link 
      href={href}
      className="group flex items-center gap-2 "
    >
      {/* The Dot */}
      <div 
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-white transition-all duration-300",
          isActive 
            ? "opacity-100 scale-100" // Active: Visible
            : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-75" // Inactive: Hidden (but shows small ghost dot on hover)
        )} 
      />
      
      {/* The Text */}
      <span className={cn(
        "text-lg font-bold transition-colors duration-200",
        isActive ? "text-white" : "text-red-100 group-hover:text-white"
      )}>
        {children}
      </span>
    </Link>
  )
}

const Navbar = () => {
  return (
    <div className='flex gap-x-6 items-center p-4 bg-red-500 border-b-8 border-b-white shadow-xl '>
      <Link href="/" className="mr-2">
        <Image 
          src={logoImg} 
          alt='Arsenal Hub Logo'
          className='w-[max(36px,5vw)] hover:opacity-90 transition-opacity'
        />
      </Link>
      
      <NavLink href='/'>HOME</NavLink>
      <NavLink href='/season'>SEASON</NavLink>
      <NavLink href='/squad'>SQUAD</NavLink>
      <NavLink href='/news'>NEWS</NavLink>
    </div>
  )
}

export default Navbar
