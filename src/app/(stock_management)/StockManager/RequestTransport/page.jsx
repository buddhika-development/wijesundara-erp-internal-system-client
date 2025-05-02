"use client"

import Title from '@/components/ui/Titles/Title'
import Form from 'next/form'
import React, { useActionState, useEffect, useState } from 'react'
import RequestTransportationService from '@/Action/RequestTransportationService'

const page = () => {

  const [infrastructures, setInfrastructures] = useState([])
  const [rieVarients, setRieVarients] = useState([])
  const [destinations, setDestinations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {

    const fetchIntrastructureData = async () => {

      try{
        const infrastructures_response = await fetch('http://localhost:5000/api/infrastructure')
        const rice_varient_response = await fetch('http://localhost:5000/api/rice_varient')

        if(!infrastructures_response.ok && !rice_varient_response.ok) {
          throw new Error("Something bad happen in data fetching process...")
        }

        const infrastructures = await infrastructures_response.json()
        const rice_varients = await rice_varient_response.json()
        
        setInfrastructures(infrastructures)
        setRieVarients(rice_varients)
      }
      catch(err){
        console.error(`Something went wrong in process... ${err}`)
        setError(err)
      }
      finally{
        setIsLoading(false)
      }
      
    }

    fetchIntrastructureData()
    
  }, [infrastructures])


  // input handling function
  const handleSourceLocation = async (e) => {
    console.log(e.target.value)
    selectDestinationLocation(e.target.value)
  }

  // select destination location list function
  const selectDestinationLocation = (source) => {
    const destinationLocationList = infrastructures.filter((infrastructure) => infrastructure["_id"] != source)
    setDestinations(destinationLocationList)
  }
  
  const initialState = {
    success : false,
    message : ''
  }

  const [state, requestTransporationAction, isPending] = useActionState(RequestTransportationService, initialState)
  
  return (

    <div>

      {/* form section */}
      <div className="table-content w-[800px]">
        <Title title_content='Request for transportation' />

        {/* transportation service request form */}
        <div className='mt-5'>

          {/* check error occurences and show the error occurance */}
          {
            error && (
              <p>Something went wrong. Please try later..</p>
            )
          }

          <Form action={requestTransporationAction}>
            <div className="input-section">
              <label htmlFor="trip-source">Source location : </label>
              <select name='trip-source' onChange={handleSourceLocation}>
                {
                  infrastructures.map((infrastructure, index) => (
                    <option value={infrastructure["_id"]} key={index}>{infrastructure["infrastructure_name"]}</option>
                  ))
                }
              </select>
            </div>
            <div className="input-section">
              <label htmlFor="trip-destination">Destination location : </label>
              <select name='trip-destination'>
                {
                  destinations.map((infrastructure, index) => (
                    <option value= {infrastructure['_id']} key={index}>{infrastructure["infrastructure_name"]}</option>
                  ))
                }
              </select>
              {
                state?.error?.trip_destination && (
                  <p className='text-sm text-red-700'>{state.error.trip_destination}</p>
                )
              }
            </div>

            <div className="input-section">
              <label htmlFor="rice_varient">Type of rice : </label>
              <select name='rice_varient'>
                {
                  rieVarients.map((rieVarient, index) => (
                    <option value= {rieVarient['_id']} key={index}>{rieVarient["rice_type"]}</option>
                  ))
                }
              </select>
            </div>

            <div className="input-section">
              <label htmlFor="stock_amount">Stock amount : </label>
              <input type="number" name="stock_amount" />
                {
                  state?.error?.stock_amount && (
                    <p className='text-sm text-red-700'>{state.error.stock_amount}</p>
                  )
                }
              
            </div>

            <input type="submit" value="Request Transportaion" className="submit-btn mt-[20px] w-full" />
            
          </Form>

          {
            state?.error  && (
              <p className='bg-red-100 border-[1px] border-red-200 py-2.5 text-red-800 text-center rounded-lg text-sm font-semibold mt-2.5'>{state.message}</p>
            )
          }

          {
            state.success && (
              <p className='bg-green-100 border-[1px] border-green-200 text-sm text-green-800 py-2.5 rounded-lg text-center mt-2'>{state.message}</p>
            )
          }
          
        </div>

      </div>

    </div>
  )
}

export default page