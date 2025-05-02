import React from 'react'
import Image from 'next/image'
import sampleImage from '../../../public/samole-profile.jpg'

const UserAccountDetails = ({employee_name = 'sample employee name', employee_department = 'sample department', employee_image}) => {
  return (
    <div className='flex items-center gap-x-2.5'>
        <div className="employee-details flex flex-col items-end">
          <p className="employee-name font-semibold text-[14px] text-primary-text">{employee_name}</p>
          <p className="employee-department text-[12px] text-secondary-text">{employee_department}</p>
        </div>
        <div className="employee-profile-image">
          <Image
            className='h-[40px] w-[40px] bg-cover rounded-full'
            src={sampleImage}
            width={100}
            height={100}
            alt='saple profile image'
          />
        </div>
    </div>
  )
}

export default UserAccountDetails