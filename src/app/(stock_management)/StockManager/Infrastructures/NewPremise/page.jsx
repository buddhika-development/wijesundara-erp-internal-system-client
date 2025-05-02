"use client"

import { AddNewPremise } from '@/Action/AddNewPremise'
import Title from '@/components/ui/Titles/Title'
import Form from 'next/form'
import React, { useActionState } from 'react'

const page = () => {

    const initialState = {
        success : false,
        message : ''
    }

    const [state, addNewPremise, isPending] = useActionState(AddNewPremise, initialState)
    
  return (
    <div>

        <div className="table-content w-[800px]">
            <Title title_content='Add New Premise' />

            {/* form content */}
            <Form action={addNewPremise} className='flex flex-col gap-y-[16px] mt-[16px]'>
                <div className="input-section">
                    <label htmlFor="premise-name">Premise Name</label>
                    <input type="text" name='premise-name' required/>
                </div>
                <div className="input-section">
                    <label htmlFor="premise-type">Premise type</label>
                    <select name="premise-type" required>
                        <option value="office">Office</option>
                        <option value="processing plant">Processing Plant</option>
                        <option value="stores">Stores</option>
                    </select>
                </div>
                <div className="input-section">
                    <label htmlFor="contact-number">Contact Number</label>
                    <input type="text" name='contact-number' required/>
                    {
                        state?.contact_number && (
                            <p className='error-message'>{state.contact_number}</p>
                        )
                    }
                </div>
                <div className="input-section">
                    <label htmlFor="address-line-one">Address line one</label>
                    <input type="text" name='address-line-one' required/>
                </div>
                <div className="input-section">
                    <label htmlFor="address-line-two">Address line two</label>
                    <input type="text" name='address-line-two' required/>
                </div>
                <div className="input-section">
                    <label htmlFor="address-district">Located in district</label>
                    <input type="text" name='address-district' required/>
                </div>
                <div className="input-section">
                    <label htmlFor="address-city">Located city</label>
                    <input type="text" name='address-city' required/>
                </div>

                <input type="submit" value="Add new premise" className="submit-btn mt-[20px]" />
            </Form>

            {
                isPending ? (
                    <p className='processing-message-section'>Processing....</p>
                ):
                state?.error ? (
                    <p className='error-message-section'>{state.error}</p>
                )
                :state.success ? (
                    <p className="success-message-section">{state.message}</p>
                )
                :(
                    <p>{state.message}</p>
                )
            }
            
        </div>
        
    </div>
  )
}

export default page