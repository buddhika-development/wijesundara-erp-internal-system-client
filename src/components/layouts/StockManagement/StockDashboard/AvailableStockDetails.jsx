"use client"

import Title from '@/components/ui/Titles/Title'
import { useEffect, useState } from 'react'

const AvailableStockDetails = () => {

    const [stock, setStock] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/stock/availability_stats')

                if (!response.ok) {
                    throw new Error("Something went wron in data loading...")
                }

                const data = await response.json();

                const stockByRiceType = data.reduce((acc, item) => {
                    const riceType = item.rice_type;
                    acc[riceType] = (acc[riceType] || 0) + item.stock_amount;
                    return acc;
                }, {});

                const result = Object.entries(stockByRiceType).map(([rice_type, total_stock]) => ({
                    rice_type,
                    total_stock
                }));
                
                setStock(result)

            }
            catch (err) {
                console.log("Something went wrong in daata loading... " + err)
                setError(err)
            }
            finally {
                setIsLoading(false);
            }
        }

        fetch_data()
    }, [])

    return (
        <div className='table-content w-full'>
            <Title title_content='Available Stock Details' />

            {
                isLoading ? (
                    <p>Loading......</p>
                ) : error ? (
                    <p>Something went wrong....</p>
                ) : stock.length > 0 ? (
                    <table className='w-full text-left mt-[20px]'>
                        <thead className='border-0'>
                            <tr>
                                <th>Rice Type</th>
                                <th>Available Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stock.map((stock_data, index) => (
                                    <tr key={index}>
                                        <td>{stock_data['rice_type']}</td>
                                        <td>{stock_data['total_stock']}0kg</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                ) : (
                    <p>There are no data</p>
                )
            }


        </div>
    )
}

export default AvailableStockDetails