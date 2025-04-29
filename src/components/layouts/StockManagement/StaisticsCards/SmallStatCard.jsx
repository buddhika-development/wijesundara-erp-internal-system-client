import React from 'react'

const SmallStatCard = ({title= 'Small stat card title', amount = 10, icon}) => {
    return (
        <div className='SmallStatCard mt-[20px] flex items-center'>
            {/* card header section */}
            <div className="card-header flex items-center gap-[16px]">
                <div className='h-[50px] w-[50px] bg-white border=[1px] border-blue-200 rounded-full flex items-center justify-center text-2xl text-blue-900'>
                    {icon}
                </div>
                <p className='w-2/3 stat-card-header-text'>{title}</p>
            </div>

            {/* card content section */}
            <div className="cord-content text-center">
                <p className='font-bold text-5xl'>{amount}<span className='units text-xl font-normal'>Travels</span></p>
            </div>
        </div>
    )
}

export default SmallStatCard