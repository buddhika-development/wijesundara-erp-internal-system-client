"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SideBarLink = ({link_content = 'sidebar defailt name', link = '#'})=> {

  // access the pathname
  const pathname = usePathname()
  console.log(pathname)
  
  return (
    <Link href={`${link}`} className='text-sm '>
      <div className={`h-[40px] flex items-center px-4 rounded-md hover:bg-blue-100 cursor-pointer`}>{link_content}</div>
    </Link>
  )
}

export default SideBarLink