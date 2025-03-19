import StockTransporationStats from '@/components/layouts/StockManagement/StockDashboard/StockTransporationStats'
import StockCheckoutDetails from '@/components/layouts/StockManagement/StockDetails/StockCheckoutDetails'
import Title from '@/components/ui/Titles/Title'
import React from 'react'

const page = () => {
  return (
    <div>

      {/* Section header section => section title */}
      <Title title_content='Stock Checkout Details' />

      {/* body content */}
      <div className="body-content">

        <StockTransporationStats />
        
        <StockCheckoutDetails />
      </div>
      
    </div>
  )
}

export default page