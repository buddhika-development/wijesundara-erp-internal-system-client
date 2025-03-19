import React from 'react'
import SmallStatCard from '@/components/layouts/StockManagement/StaisticsCards/SmallStatCard'

const StockTransporationStats = () => {
    return (
        <div>
            <div className='secondary-stat'>
                <SmallStatCard title='Pending Arrivals' />
                <SmallStatCard title='Pending confirmations' />
                <SmallStatCard title='Total stock miss balnaces' />
            </div>
        </div>
    )
}

export default StockTransporationStats