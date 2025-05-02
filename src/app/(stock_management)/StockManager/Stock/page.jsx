import AvailableStockDetails from '@/components/layouts/StockManagement/StockDashboard/AvailableStockDetails'
import PendingArrivalsDetails from '@/components/layouts/StockManagement/StockDashboard/PendingStockPurchaseDetails'
import PendingConfirmations from '@/components/layouts/StockManagement/StockDashboard/PendingConfirmations'
import ProcessedStockDetails from '@/components/layouts/StockManagement/StockDashboard/ProcessedStockDetails'
import StockStatistics from '@/components/layouts/StockManagement/StockDashboard/StockStatistics'
import WaitingStockDetails from '@/components/layouts/StockManagement/StockDashboard/WaitingStockDetails'
import StockAvailability from '@/components/layouts/StockManagement/Stocks/StockAvailability'
import Title from '@/components/ui/Titles/Title'
import React from 'react'

const page = () => {
  return (
    <div className='w-full'>
      {/* Title section */}
      <Title title_content='Stock Dashboard' />

      {/* statisctics related to  */}
      <div className='mt-5'>
        <StockStatistics />
      </div>
      
      {/* basic stock details analysis */}
      <div className='w-full'>
        <div className='flex gap-x-5 mt-4'>
          <AvailableStockDetails />
          <StockAvailability />
        </div>
        <div className='flex gap-x-5 mt-4'>
          <ProcessedStockDetails />
          <WaitingStockDetails />
        </div>
      </div>

      {/* pending confrimation detials */}
      <PendingConfirmations />

      {/* pending arrivals details */}
      <PendingArrivalsDetails />
      
    </div>
  )
}

export default page