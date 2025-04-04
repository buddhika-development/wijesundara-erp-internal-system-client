import SideBarLink from '@/components/ui/SideBarLink'
import React from 'react'

const Sidebar = ({links}) => {
  return (

    links && (
      <div className='w-[250px] fixed top-[80px] left-0 h-[calc(100vh-80px)] common-border pt-4 px-4 bg-white'>
          <div className="stock-manager-functionalities flex flex-col gap-y-2">
            {
              links.map((link, index) => (
                <SideBarLink key={index} link_content={link['link-content']} link={link['link']} />
              ))
            }
              {/* <SideBarLink link_content='Dashboard' link='./' />
              <SideBarLink link_content='Stocks' link='./StockManager/Stock'/>
              <SideBarLink link_content='Stores' link='./StockManager/Store' />
              <SideBarLink link_content='Team' link='./StockManager/Team' />
              <SideBarLink link_content='Notifications' link='./StockManager/Notification' /> */}
          </div>
      </div>
    )
  )
}

export default Sidebar