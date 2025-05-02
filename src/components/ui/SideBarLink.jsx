"use client"

import React from 'react'
import Link from 'next/link'

const SideBarLink = ({link_content = 'sidebar defailt name', link = '#', icon})=> {
  
  return (
    <Link href={`${link}`} className='text-sm '>
      <div className={`h-[36px] flex gap-x-2 items-center px-4 rounded-md hover:bg-blue-100 cursor-pointer`}>
        <div className='text-lg'>
          {icon}
        </div>
        <p className='text-blue-950'>{link_content}</p>
      </div>
    </Link>
  )
}

export default SideBarLink