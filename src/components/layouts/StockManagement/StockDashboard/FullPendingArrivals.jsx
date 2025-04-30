"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'
import { GiConfirmed } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";


const FullStockPurchaseRquestDetails = () => {

    const [stockPurchaseRequests, setStockPurchaseRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const stockPurchaseRequest = await fetch('http://localhost:8080/api/purchase/purchase_stats')

                if (stockPurchaseRequest.ok) {
                    const stockPurchaseRequestsResponse = await stockPurchaseRequest.json()
                    const pendingPurchaseRquests = stockPurchaseRequestsResponse.filter((purchaseRequest) => purchaseRequest["purchase_details"]["purchase_status"] == "pending")
                    setStockPurchaseRequests(pendingPurchaseRquests)
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
    }, [stockPurchaseRequests])

    // function related to remove the element from the database
    const remove_purchase_request = async (id) => {

        try{
            const user_confirmation = window.confirm('Do you need to continue process of remove stock purchasing request ? ')

            if (user_confirmation){
                const api_end_point = new URL(`http://localhost:8080/api/purchase/purchase/remove/${id}`)

                const response = await fetch(api_end_point, {
                    method : 'DELETE'
                })

                if (response.ok) {
                    alert('sucess')
                }
                else{
                    alert('something went wrong')
                }
            }
            
        }   
        catch(err){
            console.log(`Something went wrong in the process of remove requested purchase.. ${err} `)
        }
        
    }

    return (
        <div className='table-content'>

            <Title title_content='Pending stock purchasing requests' />

            {
                isLoading ? (
                    <p>Loading data...</p>
                ) : (
                    error ? (
                        <p>{error}</p>
                    ) : (
                        <table className='w-full text-left mt-[20px]'>
                            <thead className='border-0'>
                                <tr>
                                    <th>Checkout Date</th>
                                    <th>Supplier name</th>
                                    <th>Stock Amount</th>
                                    <th>Contact Number</th>
                                    <th>Suplied location</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    stockPurchaseRequests.map((arrival, index) => (
                                        <tr key={index}>
                                            <td>{arrival["purchase_details"]["purchase_date"].split('T')[0]}</td>
                                            <td>{arrival["supplier"]['supplier_name']}</td>
                                            <td>{`${arrival["purchase_details"]['stock_amount']} kg`}</td>
                                            <td>{arrival["supplier"]['supplier_contact']}</td>
                                            <td>{`${arrival["supplier"]['supplier_address_line_one']} , ${arrival["supplier"]['supplier_address_line_two']} , ${arrival["supplier"]['supplier_address_city']}`}</td>
                                            <td>
                                                <button
                                                    className='w-[32px] h-[32px] flex justify-center items-center text-[16px] bg-red-100 text-red-900 rounded-md border-[1px] border-red-200 cursor-pointer'
                                                    onClick={() => { remove_purchase_request(arrival["purchase_details"]["_id"]) }}
                                                >
                                                    <MdDeleteOutline />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )
                )
            }
        </div>
    )
}

export default FullStockPurchaseRquestDetails