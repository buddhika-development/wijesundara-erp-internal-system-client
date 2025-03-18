import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import StockManagementTeam from '@/components/layouts/StockManagement/StockManagementTeam/StockManagementTeam'
import { TeamNavigations } from '@/Navigations'
import React from 'react'

const page = () => {

  const TEAM_NAVIGATION = TeamNavigations;
  
  return (
    <div className='w-full h-full'>

      {/* Secondary header section */}
      <SecondaryHeader links={TEAM_NAVIGATION} />

      {/* body content area */}
      <div className="body-content p-6">
        <StockManagementTeam />
      </div>

    </div>
  )
}

export default page