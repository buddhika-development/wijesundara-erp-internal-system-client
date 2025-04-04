"use client"

import React, { useEffect, useState } from 'react'
import SmallStatCard from '@/components/layouts/StockManagement/StaisticsCards/SmallStatCard'

const StockTransporationStats = () => {

    const [transportionTask, setTransportationTask] = useState([])
    const [totalWaitingTravels, setTotalWaitingTravels] = useState(0)
    const [totalProcessingTravels, setTotalProcessingTravels] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetch_data = async () => {
            try{
                const response = await fetch("http://localhost:8080/api/transportaion_task")
                
                if(!response.ok) {
                    throw new Error("Something went wrong in data processing");
                }

                const transportion_tasks = await response.json();
                setTransportationTask(transportion_tasks)
                
            }
            catch(err){
                console.log("Something went wrong... " + err)
                setError(err)
            }
            finally{
                setIsLoading(false)
            }
        }

        fetch_data()
         
    }, [])

    useEffect(() => {
        const waitingTravels = transportionTask.filter((items) => items["transportation_status"] === "waiting")
        setTotalWaitingTravels(waitingTravels)
    }, [transportionTask])
    
    useEffect(() => {
        const processingTravels = transportionTask.filter((items) => items["transportation_status"] === "processing")
        setTotalProcessingTravels(processingTravels)
    }, [transportionTask])
    
    return (
        <div>
            {
                isLoading ? (
                    <p>Loading.........</p>
                )
                : error ? (
                    <p>{error}</p>
                )
                : (
                    <div className='secondary-stat'>
                        <SmallStatCard title='Total waiting travels ' amount={totalWaitingTravels.length} />
                        <SmallStatCard title='Pending confirmations' amount={totalProcessingTravels.length} />
                        <SmallStatCard title='Total active transporations' amount={transportionTask.length} />
                    </div>
                )
            }
        </div>
    )
}

export default StockTransporationStats