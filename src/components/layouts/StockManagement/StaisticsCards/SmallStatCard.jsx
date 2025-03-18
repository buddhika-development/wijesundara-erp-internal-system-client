import React from 'react'

const SmallStatCard = () => {
    return (
        <div className='SmallStatCard mt-[20px] flex items-center'>
            {/* card header section */}
            <div className="card-header flex items-center gap-[16px]">
                <div className='h-[50px] w-[50px] bg-red-200 rounded-full'></div>
                <p className='w-2/3 stat-card-header-text'>Ready stock availability</p>
            </div>

            {/* card content section */}
            <div className="cord-content text-center">
                <p className='font-bold text-5xl'>1000<span className='units text-xl font-normal'>kg</span></p>
            </div>
        </div>
    )
}

export default SmallStatCard