import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import StockManagementAtendence from '@/components/layouts/StockManagement/StockManagementTeam/StockManagementAtendence'
import Title from '@/components/ui/Titles/Title'
import { TeamNavigations } from '@/Navigations'
import React from 'react'

const page = () => {

  const TEAM_NAVIGATION = TeamNavigations;

  return (
    <div className='h-full'>

      <SecondaryHeader links={TeamNavigations} />

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