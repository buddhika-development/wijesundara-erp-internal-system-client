"use client"

import React, { useEffect, useState } from 'react'
import PendingConfrimationTransportation from './PendingConfrimationTransportation';
import WaitingTransportation from './WaitingTransportation';
import PendingTransportationServiceRequestsDetails from './PendingTransportationServiceRequestsDetails';

const FullPendingConfirmation = () => {

    const [travels, setTravels] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [pendingTransportationServiceRequests, setPendingTransportationServiceRequests] = useState([])
    const [pendingConfirmations, setPendingConfirmations] = useState([])
    const [doneTransportaions, setDoneTransportaions] = useState([])
    const [witingTransportations, setWitingTransportations] = useState([])

    useEffect(() => {

        const fetch_date = async () => {

            try {
                const response = await fetch('http://localhost:8080/api/transportaion_task/trasnportation_task_assginment/stats')

                if (!response.ok) {
                    throw new Error("Something went wrong.....")
                }

                const travel_details = await response.json()

                setTravels(travel_details)
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

    }, [travels])


    useEffect(() => {

        const fetchData = async() => {
            try{
                const waitingTransportationRequestsResponse = await fetch('http://localhost:8080/api/transportaion_task/transportation_tasks/waiting')

                if(!waitingTransportationRequestsResponse.ok) {
                    throw new Error("Data fetching processing process failed...")
                }

                const waitingTransportationRequests = await waitingTransportationRequestsResponse.json()
                setPendingTransportationServiceRequests(waitingTransportationRequests)
                
            }
            catch(err) {
                console.log(`Something went wrong in waiting ransportain request data accessing processs... ${err}`)
            }
        }
        
        fetchData()
        
    }, [pendingTransportationServiceRequests])



    useEffect(() => {

        const filter_pending_confrimation_transportations = () => {

            try{
                const pending_confirmation_transportations = travels.filter((travel) => travel["transportation_status"] == "processing")
                setPendingConfirmations(pending_confirmation_transportations)
            }
            catch(err){
                console.log(`Something went wrong in pending congirmation transportation filter process.. ${err}`)
                setError(err)
            }
        }

        const filter_waiting_transportations = () => {
            try{
                const waiting_transportations = travels.filter((travel) => travel["transportation_status"] = "waiting")
                setWitingTransportations(waiting_transportations)
            }
            catch(err){
                console.log(`Something went wrong in waiting transporation filtering process... ${err}`)
            }
        }
        
        const filter_done_transportation = () => {
            
            try{
                const done_transportation = travels.filter((travel) => travel["transportation_status"] == "done")
                setDoneTransportaions(done_transportation)
            }
            catch(err) {
                console.log(`Something went wrong in already done transporation filtering process... ${err}`)
                setError(err)
            }
        }

        filter_pending_confrimation_transportations()
        filter_waiting_transportations()
        filter_done_transportation()
        
    }, [travels])

    console.log(pendingConfirmations)

    return (
        <div>
            {
                isLoading ? (
                    <p>Loading....</p>
                )
                    : error ? (
                        <p>{error}</p>
                    )
                        : travels.length > 0 ? (

                            <div>
                                {/* pending confirmation details */}
                                <PendingConfrimationTransportation pendingConfirmations={pendingConfirmations} />

                                {/* waiting transportaion request details */}
                                <PendingTransportationServiceRequestsDetails pendingTransportations={pendingTransportationServiceRequests}/>
                                
                                {/* waiting transportaion detials */}
                                <WaitingTransportation waitingTransportation={witingTransportations} />
                            </div>
                        )
                            : (
                                <p>There are no valid data...</p>
                            )
            }

        </div>
    )
}

export default FullPendingConfirmation