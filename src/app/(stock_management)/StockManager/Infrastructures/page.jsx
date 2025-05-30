"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const page = () => {

  const [infrastructures, setInfrastructures] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetch_data = async () => {
      try{
        const infrastructures_response = await fetch('http://localhost:5000/api/infrastructure')

        if(!infrastructures_response.ok) {
          throw new Error("Something went wrong in data fetching...")
        }

        const infrastructure_details = await infrastructures_response.json()
        setInfrastructures(infrastructure_details)
        
      }
      catch(err){
        console.log("something went wrong while data fetching....")
        setError(err)
      }
      finally{
        setIsLoading(false)
      }
    }

    fetch_data();
    
  }, [])
  
  return (
    <div className='table-content text-left'>

      <Title title_content='Infrastructure premises company owned' />
      
      {
        isLoading ? (
          <p>Loading.....</p>
        )
        : error ? (
          <p>{error}</p>
        )
        : infrastructures.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Premise Name</th>
                  <th>Type of premis</th>
                  <th>Premise Contact</th>
                  <th>Premise Address</th>
                </tr>
              </thead>
              <tbody>
                {
                  infrastructures.map((infra, index) => (
                    <tr key={index}>
                      <td>{infra["infrastructure_name"]}</td>
                      <td>{infra["infrastructure_type"]}</td>
                      <td>{infra["contact_number"]}</td>
                      <td>{`${infra["infrastructure_address_line_one"]} , ${infra["infrastructure_address_line_two"]}, ${infra["infrastructure_address_city"]}`}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
        : (
          <div className='mt-5'>
            <p>Opps! there are no any infrastructure details...</p>
          </div>
        )
      }
    </div>
  )
}

export default page