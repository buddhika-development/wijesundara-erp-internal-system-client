import StockAnalytics from '@/components/layouts/StockManagement/StockDashboard/StockAnalytics'
import StockInPremiseAnalytics from '@/components/layouts/StockManagement/StockDashboard/StockInPremiseAnalytics'
import StockStatistics from '@/components/layouts/StockManagement/StockDashboard/StockStatistics'
import StockStatusAnalitics from '@/components/layouts/StockManagement/StockDashboard/StockStatusAnalitics'
import React from 'react'

const page = () => {
  return (
    <div>

      {/* stock availability statistics */}
      <div className='flex gap-4'>
        <StockAnalytics />
        <StockInPremiseAnalytics />
      </div>

      <div className='mt-8'>    
        <StockStatistics />
      </div>
      
      
    </div>
  )
}

export default page