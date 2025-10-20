import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

import logoImg from "../../../public/cannon.png"

interface NavLinkProps {
  children: ReactNode
  href: string
}

const NavLink = ({children, href}: NavLinkProps) => { 

  return (
    <Link 
      href={href}
      className='text-white font-bold'
    >
      {children}
    </Link>
  )
}

const Navbar = () => {
  return (
    <div className='flex gap-x-8 items-center p-4 bg-red-500 border-b-8 border-b-white shadow-xl'>
      {/* <h1 className='text-white text-2xl'>Arsenal Hub</h1> */}
      <Image 
        src={logoImg} 
        alt='Arsenal Hub Logo'
        className='w-[max(36px,5vw)]'
      />
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/season'>Season</NavLink>
      <NavLink href='/squad'>Squad</NavLink>
      <NavLink href='/news'>News</NavLink>
    </div>
  )
}

export default Navbar
