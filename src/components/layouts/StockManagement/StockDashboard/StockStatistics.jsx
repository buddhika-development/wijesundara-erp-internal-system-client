"use client"

import React, { useEffect, useState } from 'react'
import LargeStatCard from '@/components/layouts/StockManagement/StaisticsCards/LargeStatCard'
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import { LuFactory } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import { TfiShoppingCartFull } from "react-icons/tfi";

const StockStatistics = () => {

    const [stock, setStock] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalStock, setTotalStock] = useState(0)
    const [processingStock, setProcessingStock] = useState(0)
    const [processedStock, setProcessedStock] = useState(0)
    const [readyStock, setReadyStock] = useState(0)

    useEffect(() => {
        const fetch_data = async () => {

            try {
                const response = await fetch('http://localhost:5000/api/stock/availability_stats')

                if (!response.ok) {
                    throw new Error("Somthing went wrong data loding....")
                }
                const stock_details = await response.json()
                setStock(stock_details)

            }
            catch (err) {
                console.log("Something went wrong.... " + err)
                setError(err)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetch_data()
    }, [])


    // calculate the total of stocks
    useEffect(() => {
        let total = 0;
        for (let s of stock) {
            total += Number(s["stock_amount"]); // Ensure it's a number
        }
        setTotalStock(total);
    }, [stock]);


    // processing data which are status is processing
    useEffect(() => {
        let total = 0 ;
        const processingStocks = stock.filter((item) => item["stock_status"] === "processing");

        for (let s of processingStocks) {
            total += Number(s["stock_amount"])
        }

        setProcessingStock(total)
        
    }, [stock])


    // processing data which are staus is processed
    useEffect(() => {
        let total = 0;
        const processedStock = stock.filter((item) => item["stock_status"] === "processed");

        for (let s of processedStock) {
            total += Number(s["stock_amount"])
        }

        setProcessedStock(total)
    },[stock])
    

    useEffect(() => {
        let total = 0;
        const readyStocks = stock.filter((item) => item["stock_status"] != "waiting");

        for (let stock of readyStocks) {
            total += Number(stock["stock_amount"])
        }

        setReadyStock(total)
    })
    

    return (
        <div>

            {
                isLoading ? (
                    <p>Loading....</p>
                ) : stock.length > 0 ? (
                    <div className='flex justify-between gap-x-[16px]'>
                        <LargeStatCard title='Ready stock availability' stock={readyStock} icon={<MdOutlineLibraryAddCheck />} />
                        <LargeStatCard title='Processing stock' stock={processingStock} icon={<LuFactory />} />
                        <LargeStatCard title='Ready to delivery' stock={processedStock} icon={<LuClipboardCheck />} />
                        <LargeStatCard title='Total stock amount' stock={totalStock} icon={<TfiShoppingCartFull />} />
                    </div>
                ) :
                    (
                        <p>There are no data</p>
                    )
            }

        </div>
    )
}

export default StockStatistics