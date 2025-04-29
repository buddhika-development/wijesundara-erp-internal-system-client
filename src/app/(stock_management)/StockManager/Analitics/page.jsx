import StockAnalytics from '@/components/layouts/StockManagement/StockDashboard/StockAnalytics'
import StockInPremiseAnalytics from '@/components/layouts/StockManagement/StockDashboard/StockInPremiseAnalytics'
import React from 'react'

const page = () => {
  return (
    <div>

      {/* stock availability statistics */}
      <div className='flex gap-4'>
        <StockAnalytics />
        <StockInPremiseAnalytics />
      </div>
      
    </div>
  )
}

export default page