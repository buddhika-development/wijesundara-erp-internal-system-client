"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'
import { GiConfirmed } from "react-icons/gi";
import { MdErrorOutline } from "react-icons/md";

const FullPendingConfirmation = () => {

    const [travels, setTravels] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetch_date = async () => {

            try{
                const response = await fetch('http://localhost:8080/api/transportaion_task/trasnportation_task_assginment/stats')

                if(!response.ok) {
                    throw new Error("Something went wrong.....")
                }

                const travel_details = await response.json()
                setTravels(travel_details)
            }
            catch(err) {
                console.log(`Something went wrong in data loading.... ${err}`)
                setError(err)
            }
            finally{
                setLoading(false)
            }
        }

        fetch_date()
        
    }, [])

    
    return (
        <div>
            {
                isLoading ? (
                    <p>Loading....</p>
                )
                :error ? (
                    <p>{error}</p>
                )
                : travels.length > 0 ? (
                    <div className='table-content w-full mt-5'>
                        <Title title_content='Pending confirmations' />

                        {/* table of available stock detials */}
                        <table className='w-full text-left mt-[20px]'>
                            <thead className='border-0'>
                                <tr>
                                    <th>Source</th>
                                    <th>Destination</th>
                                    <th>Stock Amount</th>
                                    <th>Vehicle Number</th>
                                    <th>Driver Name</th>
                                    <th>Contact Number</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    travels.map((travel, index) => (
                                        <tr key={index}>
                                            <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                            <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                            <td>{`${travel["transportation_stock_amount"]} kg`}</td>
                                            <td>{travel["transportation_vehivle_number"]}</td>
                                            <td>{travel["transportation_driver_name"]}</td>
                                            <td>{travel["transportation_contact_number"]}</td>
                                            <td className='flex gap-x-2 mt-[4px]'>
                                                <button className='bg-red-100 border-[1px] rounded-xl border-red-200 w-[40px] h-[40px] cursor-pointer flex justify-center items-center'><MdErrorOutline className='w-[20px] h-[20px] text-red-800' /></button>
                                                <button className='bg-green-100 border-[1px] rounded-xl border-green-200 w-[40px] h-[40px] cursor-pointer flex justify-center items-center'><GiConfirmed className='h-[20px] w-[20px] text-green-800'/></button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>
                )
                :(
                    <p>There are no valid data...</p>
                )
            }
            
        </div>
    )
}

export default FullPendingConfirmation