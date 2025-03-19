import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import { StockNavigation } from '@/Navigations'
import React from 'react'

const STOCK_MANAGEMENT_STOCK_NAVIGATIONS = StockNavigation;

const layout = ({children}) => {
  return (
    <div>
        
        {/* Sub header section */}
        <SecondaryHeader links={STOCK_MANAGEMENT_STOCK_NAVIGATIONS} />

        {/* body content */}
        <div className='p-4 w-full'>
            {children}
        </div>
        
    </div>
  )
}

export default layout