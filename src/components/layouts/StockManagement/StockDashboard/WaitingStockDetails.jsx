"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const WaitingStockDetails = () => {

    const [stock, setStock] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetch_data = async () => {
            try{

                const stock_response = await fetch('http://localhost:5000/api/stock/availability_stats')

                if(!stock_response.ok) {
                    throw new Error("Data fetching falled...")
                }

                const stock_details = await stock_response.json()
                const temp_data = stock_details.filter((item) => item["stock_status"] === "waiting")
                setStock(temp_data)
                
            }
            catch(err) {
                console.log(`Something went wrong : ${err}`)
                setError(err)
            }
            finally{
                setIsLoading(false)
            }
        }
        
        fetch_data()
        
    }, [])

    console.log(stock)
    
  return (
    <div className='table-content w-full'>

        <Title title_content='Stocks are in waiting to process' />

        {
            isLoading ? (
                <p>Loading...</p>
            )
            :error ? (
                <p>{error}</p>
            )
            :stock.length > 0 ? (
                <table className='w-full text-left mt-[20px]'>
                    <thead className='border-0'>
                        <tr>
                            <th>Rice Type</th>
                            <th>Available Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stock.map((item, index) => (
                                <tr key={index}>
                                    <td>{item["rice_type"]}</td>
                                    <td>{`${item["stock_amount"]} kg`}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
            :(
                <p>Thre is no valid data</p>
            )
        }
        
    </div>
  )
}

export default WaitingStockDetails