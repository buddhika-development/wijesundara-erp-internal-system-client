"use client"

import Title from '@/components/ui/Titles/Title';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [bids, setBids] = useState([])

    useEffect(() => {

        const fetchBidDetails = async () => {
            try {
                const bid_response = await fetch('http://localhost:8080/api/bids')

                if (!bid_response.ok) {
                    throw new Error('Data fetching error....')
                }

                const bids = await bid_response.json()
                setBids(bids)
            }
            catch (err) {
                console.log(`Something went wrong in data fetching process... ${err}`)
                setError(err)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchBidDetails()
    }, [])


    return (
        <div className='table-content w-full mt-5'>

            <div className="header-section flex w-full justify-between">
                <Title title_content='Recent Bids' />
                <Link href={'http://localhost:3000/StockManager/Stock/AddStock'}
                      className='bg-blue-900 flex justify-center items-center px-5 py-2 rounded-md text-white'
                >
                    Place Order
                </Link>
            </div>

            {
                error ? (
                    <div>
                        <p>Something happening bad..Try again later..</p>
                        <p>{error}</p>
                    </div>
                ):(
                    isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className='w-full text-left mt-[20px]'>
                            <thead className='border-0'>
                                <tr>
                                    <th>Supplier Name</th>
                                    <th>Rice Type</th>
                                    <th>Bid Price</th>
                                </tr>
                            </thead>
                            {
                                bids.length > 0 && (
                                    <tbody>
                                        {
                                            bids.map((bid, index) => (
                                                <tr key={index}>
                                                    <td>{bid["supplier_details"]["supplier_name"]}</td>
                                                    <td>{bid["rice_varient"]["rice_type"]}</td>
                                                    <td>rs. {bid["bid_details"]["bid_price"].toFixed(2)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                )
                            }
                        </table>
                    )
                )
            }
        </div>

    )
}

export default page