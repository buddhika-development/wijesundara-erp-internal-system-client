"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const PendingTransportationStats = () => {

    const [travels, setTravels] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_date = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/transportaion_task/')
                if (!response.ok) {
                    throw new Error("Something went wrong.....")
                }
                const travel_details = await response.json()
                const data = travel_details.filter((item) => item?.transportation_status === 'waiting').slice(1,6)
                setTravels(data)
            }
            catch (err) {
                console.log(`Something went wrong in data loading.... ${err}`)
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetch_date()
    }, [])


    return (
        <div className='w-full'>

            {
                isLoading ? (
                    <p>Loading....</p>
                )
                : error ? (
                    <p>{error}</p>
                )
                :travels.length > 0 ? (        
                    <div className='table-content w-full'>
                        <Title title_content='Pending Transportaiotns' />

                        {/* table of available stock detials */}
                        <table className='w-full text-left mt-[20px]'>
                            <thead className='border-0'>
                                <tr>
                                    <th>Rice Type</th>
                                    <th>Available Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    travels.map((travel, index) => (
                                        <tr key={index}>
                                            <td>{travel["rice_type"]}</td>
                                            <td>{`${travel['transportation_stock_amount']} kg`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>
                )
                :(
                    <p>There are no valid data</p>
                )
            }
            
        </div>
    )
}

export default PendingTransportationStats