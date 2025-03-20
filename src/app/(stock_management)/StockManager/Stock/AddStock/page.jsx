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
        
    const [riceType, setRiceType] = useState([])
    const [supplier, setSupplier] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch_data = async () => {

            try {
                const rice_varient_response = await fetch('http://localhost:8080/api/rice_varient')
                const supplier_response = await fetch('http://localhost:8080/api/suppliers')

                if (!rice_varient_response.ok || !supplier_response.ok) {
                    throw new Error("Something went wrong in data fecthing....")
                }

                const rice_varients = await rice_varient_response.json()
                const supplier_detail = await supplier_response.json()

                setRiceType(rice_varients)
                setSupplier(supplier_detail)
            }
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
                                    <select name="supplier">
                                        {
                                            supplier.map((supplier, index) => (
                                                <option key={index} value={supplier["_id"]} >{supplier["supplier_name"]}</option>
                                            ) )
                                        }
                                    </select>
                                </div>

                                <div className="input-section">
                                    <label htmlFor="rice_type">Type of Rice</label>
                                    <select name="rice_type">
                                        {
                                            riceType.map((type, index) => (
                                                <option key={index} value={type["_id"]} >{type["rice_type"]}</option>
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
                                    <p className='bg-green-100 border-[1px] border-green-200 text-sm text-green-800 py-2.5 rounded-lg text-center'>{state.message}</p>
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