"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {

        const fetchData = async () => {

            try{
                const response = await fetch("http://localhost:8080/api/stock/availability_stats")

                if(!response.ok) {
                    throw new Error("Something went wron in data fetching process,...")
                }

                const stock_details = await response.json()

                const limitedStocks = stock_details.filter((stock_detail) => stock_detail["stock_amount"] < 2500)
                setNotifications(limitedStocks)
                
            }
            catch(err){
                console.log(`Someting went wrong.. ${err}`)
                setError(err)
            }
            finally{
                setIsLoading(false)
            }   
        }

        fetchData()
        
    }, [])    
    
  return (
    <div className='mt-5'>
        <Title title_content='Notifications' />

        <div className='mt-5'>

            {
                notifications.map((notification, index) => (
                    <div key={index} className='bg-white p-4 mb-4 rounded-xl shadow-sm w-1/2'>
                        <h3 className='font-semibold text-[16px]'>{notification["rice_type"]} Stock low</h3>
                        <p className='text-blue-950/60 text-[14px]'>Please check and refill the stock as soon as posible stock reach to limites. There are only available {notification["stock_amount"]} in the state of {notification["stock_status"]}</p>
                    </div>
                ))
            }
            
        </div>
        
    </div>
  )
}

export default page