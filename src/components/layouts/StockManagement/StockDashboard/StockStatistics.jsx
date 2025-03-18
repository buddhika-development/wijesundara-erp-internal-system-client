import React from 'react'
import LargeStatCard from '@/components/layouts/StockManagement/StaisticsCards/LargeStatCard'

const StockStatistics = () => {
    return (
        <div>
            <div className='flex justify-between gap-x-[16px]'>
                <LargeStatCard />
                <LargeStatCard />
                <LargeStatCard />
                <LargeStatCard />
            </div>
        </div>
    )
}

export default StockStatistics