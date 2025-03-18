import SideBarLink from '@/components/ui/SideBarLink'
import React from 'react'
import { MdOutlineSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className='w-[250px] h-[100vh] common-border pt-4 px-4 bg-white'>
        <div className="stock-manager-functionalities flex flex-col gap-y-2">
            <SideBarLink link_content='Dashboard' link='./' />
            <SideBarLink link_content='Stocks' link='./StockManager/Stock'/>
            <SideBarLink link_content='Stores' link='./StockManager/Store' />
            <SideBarLink link_content='Team' link='./StockManager/Team' />
            <SideBarLink link_content='Notifications' link='./StockManager/Notification' />
        </div>
    </div>
  )
}

export default Sidebar