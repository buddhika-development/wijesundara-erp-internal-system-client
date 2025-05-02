"use client"

import { AddStockActionHandler } from '@/Action/AddStockAction'
import Title from '@/components/ui/Titles/Title'
import React, { useActionState, useEffect, useState } from 'react'
import Form from 'next/form'

const page = () => {

    const initialState  = {
        success : false,
        message : ''
    }

    const [state, formAction, isPending] =  useActionState(AddStockActionHandler, initialState)
        
    const [bids, setBids] = useState([])
    const [supplierBids, setSupplierBids] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_data = async () => {

            try {

                const bid_response = await fetch('http://localhost:5000/api/bids')

                if(!bid_response.ok) {
                    throw new Error("Something went wrong in bid data fetching process...")
                }

                const bids = await bid_response.json()
                setBids(bids)            }

            catch (err) {
                console.log("Something went wrong....")
                setError(err)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetch_data()

    }, [])


    // onchange function related to how bids are actually showing off in the form`
    const handleSupplierSelection = (e) => {
        const supplier_id = e.target.value
        selectSupplierBids(supplier_id)
    }

    const selectSupplierBids = (supplier_id) => {
        const supplier_bids = bids.filter((bid) => bid["supplier_details"]["_id"] == supplier_id)
        setSupplierBids(supplier_bids)
    }
 
    return (
        <div>

            {
                isLoading ? (
                    <p>Loading....</p>
                )
                : error ? (
                    <p>{error}</p>
                )
                : (
                    <div>
                        <div className='table-content w-[800px]'>
                            <Title title_content='Add New Stock' />
                            <Form action={formAction} className='flex flex-col mt-5 gap-y-4'>
                                <div className="input-section">
                                    <label htmlFor="supplier">Stock Supplier</label>
                                    <select name="supplier" onChange={handleSupplierSelection}>
                                        {
                                            bids.map((bid, index) => (
                                                <option key={index} value={bid["supplier_details"]["_id"]} >{bid["supplier_details"]["supplier_name"]}</option>
                                            ) )
                                        }
                                    </select>
                                </div>

                                <div className="input-section">
                                    <label htmlFor="rice_type">Type of Rice</label>
                                    <select name="rice_type">
                                        {
                                            supplierBids.map((bid, index) => (
                                                <option key={index} value={bid["rice_varient"]["_id"]} >{bid["rice_varient"]["rice_type"]}</option>
                                            ) )
                                        }
                                    </select>
                                </div>

                                <div className="input-section">
                                    <label htmlFor="stock_amount">Stock amount</label>
                                    <input type="number" name="stock_amount" id="" />
                                    {
                                        state?.stock_amount && (
                                            <p className='text-sm text-red-700'>{state.stock_amount}</p>
                                        )
                                    }
                                </div>

                                <input type="submit" value="Add New Stock" className='submit-btn cursor-pointer mt-5' />
                            </Form>
                            {
                                state?.error && (
                                    <p className='bg-red-100 border-[1px] border-red-200 py-2.5 text-red-800 text-center rounded-lg text-sm font-semibold mt-2.5'>{state.error}</p>
                                ) 
                            }

                            {
                                state.success && (
                                    <p className='bg-green-100 border-[1px] border-green-200 text-sm text-green-800 py-2.5 rounded-lg text-center mt-2'>{state.message}</p>
                                )
                            }
                        </div>
                    </div>
                
                )
            }


        </div>
    )
}

export default page