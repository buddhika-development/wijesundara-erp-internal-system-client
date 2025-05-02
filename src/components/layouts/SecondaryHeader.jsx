import React from 'react'
import SideBarLink from '../ui/SideBarLink'

const SecondaryHeader = ({links}) => {
  return (
    links &&
    <div className='h-[60px] border-b-[1px] common-border w-full flex items-center px-4 bg-white'>
      {
        links.map((link,index) => (
          <SideBarLink link={link['link']} link_content= {link['link-content']} key={index} />
        ))
      }
    </div>
  )
}

export default SecondaryHeader