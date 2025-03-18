import DashboardSecondaryHeader from '@/components/layouts/StockManagement/DashboardSecondaryHeader'
import LargeStatCard from '@/components/layouts/StockManagement/StaisticsCards/LargeStatCard'
import SmallStatCard from '@/components/layouts/StockManagement/StaisticsCards/SmallStatCard'
import React from 'react'

const page = () => {
  return (
    <div className='p-6'>

      {/* main statistics card section */}
      <div className='flex justify-between gap-[16px]'>
        <LargeStatCard />
        <LargeStatCard />
        <LargeStatCard />
        <LargeStatCard />
      </div>

      {/* secondary statistic card section */}
      <div className='secondary-stat'>
        <SmallStatCard />
        <SmallStatCard />
        <SmallStatCard />
      </div>
      
    </div>
  )
}

export default page