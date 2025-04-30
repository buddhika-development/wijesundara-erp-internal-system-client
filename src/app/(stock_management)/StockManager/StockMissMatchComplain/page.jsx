"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [stockDetails, setStockDetails] = useState([])
    const [lessStockDetails, setLessStockDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {

        const fetchData = async () => {

            try{
                const stock_data_reponse = await fetch('http://localhost:8080/api/stock/availability_stats')

                if(!stock_data_reponse.ok) {
                    throw new Error("Something went wrong in data fetching process...")
                }

                const stock_data = await stock_data_reponse.json()
                setStockDetails(stock_data)
            }
            catch(err) {
                setError(err)
            }
            finally{
                setIsLoading(false)
            }
        }

        fetchData()
        
    }, [])

    
    const filterLessStockDetails = async () => {
        const lessStocks = await stockDetails.filter((stockDetail) => stockDetail["stock_amount"] < 5000)
        setLessStockDetails(lessStocks)
    }
    filterLessStockDetails()
    

  return (
    <div>

        <Title title_content='Notifications' />
        
    </div>
  )
}

export default page