import React from 'react'

const LargeStatCard = () => {
  return (
    <div className='LargeStatCard'>

      {/* card header section */}
      <div className="card-header flex items-center gap-[16px]">
        <div className='h-[50px] w-[50px] bg-red-200 rounded-full'></div>
        <p className='w-1/3 stat-card-header-text'>Ready stock availability</p>
      </div>

      {/* card content section */}
      <div className="cord-content mt-5 text-center">
        <p className='font-bold text-5xl'>1000<span className='units text-xl font-normal'>kg</span></p>
      </div>
      
    </div>
  )
}

export default LargeStatCard