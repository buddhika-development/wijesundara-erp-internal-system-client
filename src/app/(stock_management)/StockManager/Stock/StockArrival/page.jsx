import FullPendingArrivalsDetails from '@/components/layouts/StockManagement/StockDashboard/FullPendingArrivals'
import StockTransporationStats from '@/components/layouts/StockManagement/StockDashboard/StockTransporationStats'
import Title from '@/components/ui/Titles/Title'
import React from 'react'

const page = () => {
  return (
    <div>

      <Title />

      {/* Main body content area */}
      <div>
        <StockTransporationStats />
      </div>

      <FullPendingArrivalsDetails />
      
    </div>
  )
}

export default page