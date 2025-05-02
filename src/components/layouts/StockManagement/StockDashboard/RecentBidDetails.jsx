"use client"

import Title from '@/components/ui/Titles/Title';
import React, { useEffect, useState } from 'react'
import { RotateLoader } from "react-spinners";

const RecentBidDetails = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [bids, setBids] = useState([])

    useEffect(() => {

        const fetchBidDetails = async () => {
            try {
                const bid_response = await fetch('http://localhost:5000/api/bids')

                if (!bid_response.ok) {
                    throw new Error('Data fetching error....')
                }

                const bids = await bid_response.json()
                const set_bids = bids.slice(0,6)
                setBids(set_bids)
            }
            catch (err) {
                console.log(`Something went wrong in data fetching process... ${err}`)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchBidDetails()
    }, [])


    return (
        <div className='table-content w-full'>

            <Title title_content='Recent Bids' />

            {
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
            }
        </div>

    )
}

export default RecentBidDetails