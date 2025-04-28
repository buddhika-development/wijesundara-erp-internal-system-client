"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'
import { GiConfirmed } from "react-icons/gi";

const PendingArrivalsDetails = () => {

    const [arrivals, setArrivals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const arrivals_response = await fetch('http://localhost:8080/api/purchase/purchase_stats')

                if (arrivals_response.ok) {
                    const arrival_detilas = await arrivals_response.json()

                    const temp_data = arrival_detilas.slice(1, 6)
                    setArrivals(temp_data)
                }
                else {
                    throw new Error("Something went wrong in data fetching.....")
                }
            }
            catch (err) {
                console.log('Something went wrong....')
                setError(err)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetch_data()
    }, [])

    const confitm_arrival = (arrival_id) => {

    }

    return (
        <div>

            {
                isLoading ? (
                    <p>Loading....</p>
                )
                    : error ? (
                        <p>{error}</p>
                    )
                        : arrivals.length > 0 ? (
                            <div className='table-content w-full mt-5'>
                                <Title title_content='Pending Stock Purchasing Approvals' />

                                {/* table of available stock detials */}
                                <table className='w-full text-left mt-[20px]'>
                                    <thead className='border-0'>
                                        <tr>
                                            <th>Checkout Date</th>
                                            <th>Supplier name</th>
                                            <th>Stock Amount</th>
                                            <th>Contact Number</th>
                                            <th>Suplied location</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            arrivals.map((arrival, index) => (
                                                <tr key={index}>
                                                    <td>{arrival["purchase_date"].split('T')[0]}</td>
                                                    <td>{arrival['supplier_name']}</td>
                                                    <td>{`${arrival['stock_amount']} kg`}</td>
                                                    <td>{arrival['supplier_contact']}</td>
                                                    <td>{`${arrival['supplier_address_line_one']} , ${arrival['supplier_address_line_two']} , ${arrival['supplier_address_city']}`}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                            </div>
                        )
                            : (
                                <p>There are not data</p>
                            )
            }

        </div>
    )
}

export default PendingArrivalsDetails