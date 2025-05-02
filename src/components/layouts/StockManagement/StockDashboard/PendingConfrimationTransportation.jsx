import React from 'react'
import { GiConfirmed } from "react-icons/gi";
import { MdErrorOutline } from "react-icons/md";
import Title from '@/components/ui/Titles/Title'

const PendingConfrimationTransportation = ({ pendingConfirmations }) => {
    return (
        <div className='table-content w-full mt-5'>
            <Title title_content='Pending confirmations' />

            {/* table of available stock detials */}
            <table className='w-full text-left mt-[20px]'>
                <thead className='border-0'>
                    <tr>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Stock Amount</th>
                        <th>Vehicle Number</th>
                        <th>Driver Name</th>
                        <th>Contact Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        pendingConfirmations ? (
                            pendingConfirmations.map((travel, index) => (
                                <tr key={index}>
                                    <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                    <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                    <td>{`${travel["stock_amount"]} kg`}</td>
                                    <td>{travel["transportation_vehicle_number"]}</td>
                                    <td>{travel["transportation_driver_name"]}</td>
                                    <td>{travel["transportation_contact_number"]}</td>
                                    <td className='flex gap-x-2 mt-[4px]'>
                                        <button className='bg-red-100 border-[1px] rounded-xl border-red-200 w-[32px] h-[32px] cursor-pointer flex justify-center items-center'>
                                            <MdErrorOutline className='w-[16px] h-[16px] text-red-800' /></button>
                                        <button className='bg-green-100 border-[1px] rounded-xl border-green-200 w-[32px] h-[32px] cursor-pointer flex justify-center items-center'>
                                            <GiConfirmed className='h-[16px] w-[16px] text-green-800' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) :
                            (
                                <p>Thare are no any pending transportation</p>
                            )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default PendingConfrimationTransportation