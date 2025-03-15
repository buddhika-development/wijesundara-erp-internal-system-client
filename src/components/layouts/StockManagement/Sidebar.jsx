import SideBarLink from '@/components/ui/SideBarLink'
import React from 'react'
import { MdOutlineSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className='w-[300px] h-[100vh] common-border pt-4 px-4'>
        <div className="stock-manager-functionalities flex flex-col gap-y-2">
            <SideBarLink link_content='Dashboard' link='Dashboard' />
            <SideBarLink link_content='Stocks' link='Stock'/>
            <SideBarLink link_content='Team' link='Team' />
            <SideBarLink link_content='Notifications' link='Team' />
        </div>
    </div>
  )
}

export default Sidebar