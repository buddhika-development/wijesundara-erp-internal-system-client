import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import StockManagementAtendence from '@/components/layouts/StockManagement/StockManagementTeam/StockManagementAtendence'
import Title from '@/components/ui/Titles/Title'
import React from 'react'

const teamPageLinks = [
  {
    'link-content' : 'Team',
    'link' : './Team'
  },
  {
    'link-content' : 'Attendece',
    'link' :'./Team/Attendence'
  }
]

const page = () => {
  return (
    <div className='h-full'>

      <SecondaryHeader links={teamPageLinks} />

      <div className="page-body-content  p-4">
        
        {/* page header section */}
        <div className="title-section h-full">
            <Title />
        </div>

        {/* attendance details */}
        <StockManagementAtendence />
      </div>
        
    </div>
  )
}

export default page