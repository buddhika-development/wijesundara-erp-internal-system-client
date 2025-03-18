import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import React from 'react'

const stockManagementLinks = [
    {
        'link-content' : 'Dashboard',
        'link' : './'
    },
    {
        'link-content' : 'Stocks',
        'link' : './Stocks'
    },
    {
        'link-content' : 'Checkouts',
        'link' : './Stock/StockCheckout'
    },
    {
        'link-content' : 'Arrivals',
        'link' : './Stock/StockArrival'
    }
]

const layout = ({children}) => {
  return (
    <div>
        
        {/* Sub header section */}
        <SecondaryHeader links={stockManagementLinks} />

        {/* body content */}
        <div className='p-4'>
            {children}
        </div>
        
    </div>
  )
}

export default layout