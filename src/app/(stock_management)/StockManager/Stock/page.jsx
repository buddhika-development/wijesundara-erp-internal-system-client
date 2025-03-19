import PendingArrivalsDetails from '@/components/layouts/StockManagement/StockDashboard/PendingArrivalsDetails'
import PendingConfirmations from '@/components/layouts/StockManagement/StockDashboard/PendingConfirmations'
import StockStatistics from '@/components/layouts/StockManagement/StockDashboard/StockStatistics'
import MissingStockDetails from '@/components/layouts/StockManagement/Stocks/MissingStockDetails'
import StockAvailability from '@/components/layouts/StockManagement/Stocks/StockAvailability'
import StockProcessingStats from '@/components/layouts/StockManagement/Stocks/StockProcessingStats'
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
          <StockAvailability />
          <StockProcessingStats />
        </div>
        <div className='flex gap-x-5 mt-4'>
          <StockAvailability />
          <MissingStockDetails />
        </div>
      </div>

      {/* pending arrivals details */}
      <PendingArrivalsDetails />

      {/* pending confrimation detials */}
      <PendingConfirmations />
      
    </div>
  )
}

export default page