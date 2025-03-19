import React from 'react'
import LargeStatCard from '@/components/layouts/StockManagement/StaisticsCards/LargeStatCard'

const StockStatistics = () => {
    return (
        <div>
            <div className='flex justify-between gap-x-[16px]'>
                <LargeStatCard title='Ready stock availability' />
                <LargeStatCard title='Processing stock' />
                <LargeStatCard title='Ready to delivery' />
                <LargeStatCard title='Total stock amount' />
            </div>
        </div>
    )
}

export default StockStatistics