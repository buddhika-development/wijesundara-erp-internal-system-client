import AvailableStockDetails from '@/components/layouts/StockManagement/StockDashboard/AvailableStockDetails'
import StockStatistics from '@/components/layouts/StockManagement/StockDashboard/StockStatistics'
import StockTransporationStats from '@/components/layouts/StockManagement/StockDashboard/StockTransporationStats'
import PendingTransportationStats from '@/components/layouts/StockManagement/StockDashboard/PendingTransportationStats'
import React from 'react'
import PendingStockPurchaseDetails from '@/components/layouts/StockManagement/StockDashboard/PendingStockPurchaseDetails'
import PendingConfirmations from '@/components/layouts/StockManagement/StockDashboard/PendingConfirmations'
import RecentBidDetails from '@/components/layouts/StockManagement/StockDashboard/RecentBidDetails'

const page = () => {
  return (
    <div className='p-6'>

      {/* Basic statistic data */}
      <div>
        {/* main statistics card section */}
        <StockStatistics />
        {/* secondary statistic card section */}
        <StockTransporationStats />
      </div>

      <div className='mt-[20px] grid grid-cols-2 gap-x-[16px]'>
        {/* available stock details */}
        <AvailableStockDetails />
        {/* pending customer transportion detials */}
        <RecentBidDetails />
      </div>
      
      <PendingConfirmations />

      <PendingStockPurchaseDetails />
      

    </div>
  )
}

export default page