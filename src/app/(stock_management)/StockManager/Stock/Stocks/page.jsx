import Title from '@/components/ui/Titles/Title'
import React from 'react'

const page = () => {
  return (
    <div>

      {/* Header section => section title */}
      <Title title_content='Stock Details' />

      {/* Body content */}
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
          <tr>
            <td>Keeri Samba rice</td>
            <td>Ampara main plantation</td>
            <td>1600kg</td>
            <td>Processing</td>
          </tr>
          <tr>
            <td>Keeri Samba rice</td>
            <td>Ampara main plantation</td>
            <td>1600kg</td>
            <td>Processing</td>
          </tr>
          <tr>
            <td>Keeri Samba rice</td>
            <td>Ampara main plantation</td>
            <td>1600kg</td>
            <td>Processing</td>
          </tr>
          <tr>
            <td>Keeri Samba rice</td>
            <td>Ampara main plantation</td>
            <td>1600kg</td>
            <td>Processing</td>
          </tr>
          <tr>
            <td>Keeri Samba rice</td>
            <td>Ampara main plantation</td>
            <td>1600kg</td>
            <td>Processing</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  )
}

export default page