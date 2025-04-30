import SideBarLink from '@/components/ui/SideBarLink'
import React from 'react'
import { MdLogout } from "react-icons/md";


const Sidebar = ({links}) => {
  return (

    links && (
      <div className='w-[220px] fixed top-[60px] left-0 h-[calc(100vh-60px)] common-border pt-4 pb-8 px-4 bg-white flex flex-col justify-between'>
          <div className="stock-manager-functionalities flex flex-col gap-y-2">
            {
              links.map((link, index) => (
                <SideBarLink key={index} link_content={link['link-content']} link={link['link']} icon={link['icon']}/>
              ))
            }
          </div>
          <div className="logout-section">
            <SideBarLink link_content='Logout' icon={<MdLogout/>}/>
          </div>
      </div>
    )
  )
}

export default Sidebar