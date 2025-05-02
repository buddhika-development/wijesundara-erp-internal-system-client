"use client"

import Title from '@/components/ui/Titles/Title'
import React, { useEffect, useState } from 'react'

const page = () => {

  const [stocks, setStocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch_data = async () => {

      try {
        const stock_reponse = await fetch('http://localhost:5000/api/stock/availability_stats')

        if (!stock_reponse.ok) {
          throw new Error("Something went wrong while data fetchig...")
        }

        const stock_details = await stock_reponse.json()
        setStocks(stock_details)

      }
      catch (err) {
        console.log("Something went wrong in data fetching....")
        setError(err)
      }
      finally {
        setIsLoading(false)
      }
    }

    fetch_data()

  }, [])

  return (
    <div className='table-content mt-5'>

      {/* Header section => section title */}
      <Title title_content='Stock Details' />

      {/* Body content */}
      {
        isLoading ? (
          <p>Loading....</p>
        )
          : error ? (
            <p>{error}</p>
          )
            : stocks.length > 0 ? (
              <div>
                <table className='w-full mt-6 text-left'>
                  <thead>
                    <tr className='common-border'>
                      <th>Rice Type</th>
                      <th>Premise</th>
                      <th>Stock amount</th>
                      <th>Stock Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      stocks.map((stock, index) => (
                        <tr key={index}>
                          <td>{stock['rice_type']}</td>
                          <td>{`${stock['stock_amount']} kg`}</td>
                          <td>{stock['infrastructure_name']}</td>
                          <td>{stock['stock_status']}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )
            :(

              <div className='mt-5'>
                <p>Opps! there are no any stock details.</p>
              </div>
            )
      }

    </div>
  )
}

export default page