import React from 'react'
import CompanyLogo from '../ui/CompanyLogo'
import UserAccountDetails from './UserAccountDetails'

const Header = () => {
  return (
    <div className='h-[80px] w-full flex justify-between items-center px-[40px] common-border bg-white'>
        <CompanyLogo />
        <UserAccountDetails />
    </div>
  )
}

export default Header