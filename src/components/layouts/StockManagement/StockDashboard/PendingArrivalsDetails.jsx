import Title from '@/components/ui/Titles/Title'
import React from 'react'

const PendingArrivalsDetails = () => {
    return (
        <div>
            <div className='table-content w-full mt-5'>
                <Title title_content='Available Stock Details' />

                {/* table of available stock detials */}
                <table className='w-full text-left mt-[20px]'>
                    <thead className='border-0'>
                        <tr>
                            <th>Checkout Date</th>
                            <th>Checkout Location</th>
                            <th>Stock Amount</th>
                            <th>Vehicle Number</th>
                            <th>Driver Name</th>
                            <th>Contact Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                        <tr>
                            <td>Keeri Samba</td>
                            <td>3450kg</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default PendingArrivalsDetails