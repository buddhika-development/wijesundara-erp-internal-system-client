import Title from '@/components/ui/Titles/Title'
import React from 'react'

const PendingTransportationServiceRequestsDetails = ({pendingTransportations}) => {
  return (
    <div className='table-content mt-6'>
        <Title title_content='Pending transportaion requests' />

        <table>
            <thead>
                <tr>
                    <td>Requested Date</td>
                    <td>Source Location</td>
                    <td>Destination Loaction</td>
                    <td>Rice Type</td>
                    <td>Stock Amount</td>
                </tr>
            </thead>
            <tbody>
                {
                    pendingTransportations.map((pendingTransportation, index) => (
                        <tr key={index}>
                            <td>{pendingTransportation["task_details"]["transportation_date"].split("T")[0]}</td>
                            <td>{pendingTransportation["source_details"]["infrastructure_name"]}</td>
                            <td>{pendingTransportation["destination_details"]["infrastructure_name"]}</td>
                            <td>{pendingTransportation["rice_varient_details"]["rice_type"]}</td>
                            <td>{pendingTransportation["task_details"]["stock_amount"]} kg</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        
    </div>
  )
}

export default PendingTransportationServiceRequestsDetails