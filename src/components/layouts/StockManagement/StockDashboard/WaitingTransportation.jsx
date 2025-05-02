import React from 'react'
import Title from '@/components/ui/Titles/Title'

const WaitingTransportation = ({waitingTransportation}) => {
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
                        waitingTransportation ? (
                            waitingTransportation.map((travel, index) => (
                                <tr key={index}>
                                    <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                    <td>{travel?.source?.infrastructure_name || 'undifiend'}</td>
                                    <td>{`${travel["stock_amount"]} kg`}</td>
                                    <td>{travel["transportation_vehicle_number"]}</td>
                                    <td>{travel["transportation_driver_name"]}</td>
                                    <td>{travel["transportation_contact_number"]}</td>
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

export default WaitingTransportation