"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const PendingTransportationStats = () => {

    const [travels, setTravels] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
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