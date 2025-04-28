import SideBarLink from '@/components/ui/SideBarLink'
import React from 'react'
import { FiHome } from "react-icons/fi";

const Sidebar = ({links}) => {
  return (

    links && (
      <div className='w-[220px] fixed top-[60px] left-0 h-[calc(100vh-60px)] common-border pt-4 px-4 bg-white'>
          <div className="stock-manager-functionalities flex flex-col gap-y-2">
            {
              links.map((link, index) => (
                <SideBarLink key={index} link_content={link['link-content']} link={link['link']} icon={link['icon']}/>
              ))
            }
          </div>
      </div>
    )
  )
}

export default Sidebar