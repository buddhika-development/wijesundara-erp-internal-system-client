import Title from '@/components/ui/Titles/Title'
import React from 'react'

const PendingTransportationStats = () => {
    return (
        <div className='w-full'>
            <div className='table-content w-full'>
                <Title title_content='Pending Transportaiotns' />

                {/* table of available stock detials */}
                <table className='w-full text-left mt-[20px]'>
                    <thead className='border-0'>
                        <tr>
                            <th>Rice Type</th>
                            <th>Available Stock</th>
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
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default PendingTransportationStats