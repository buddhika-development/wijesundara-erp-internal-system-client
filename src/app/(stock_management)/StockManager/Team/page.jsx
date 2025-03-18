import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import StockManagementTeam from '@/components/layouts/StockManagement/StockManagementTeam/StockManagementTeam'
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
    <div className='w-full h-full'>

      {/* Secondary header section */}
      <SecondaryHeader links={teamPageLinks} />

      {/* body content area */}
      <div className="body-content p-6">
        <StockManagementTeam />
      </div>

    </div>
  )
}

export default page