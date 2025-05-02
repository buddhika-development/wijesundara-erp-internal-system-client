import React from 'react'
import CompanyLogo from '../ui/CompanyLogo'
import UserAccountDetails from './UserAccountDetails'

const Header = () => {
  return (
    <div className='h-[60px] w-full flex justify-between items-center px-[40px] common-border bg-white fixed top-0 left-0'>
        <CompanyLogo />
        <UserAccountDetails employee_name='Tishan Yasiru' employee_department='Human Resource Management' />
    </div>
  )
}

export default Header