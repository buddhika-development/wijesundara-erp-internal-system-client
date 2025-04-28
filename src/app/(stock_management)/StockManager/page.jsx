import AvailableStockDetails from '@/components/layouts/StockManagement/StockDashboard/AvailableStockDetails'
import StockStatistics from '@/components/layouts/StockManagement/StockDashboard/StockStatistics'
import StockTransporationStats from '@/components/layouts/StockManagement/StockDashboard/StockTransporationStats'
import PendingTransportationStats from '@/components/layouts/StockManagement/StockDashboard/PendingTransportationStats'
import React from 'react'
import PendingArrivalsDetails from '@/components/layouts/StockManagement/StockDashboard/PendingArrivalsDetails'
import PendingConfirmations from '@/components/layouts/StockManagement/StockDashboard/PendingConfirmations'

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
        <PendingTransportationStats />
      </div>
      
      <PendingConfirmations />
      
      <PendingArrivalsDetails />

      
    </div>
  )
}

export default page