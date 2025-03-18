import SecondaryHeader from '@/components/layouts/SecondaryHeader'
import { InfrastructureNavigations } from '@/Navigations'
import React from 'react'

const InfrastructuresLayout = ({children}) => {

    const INFRASTRUCTURES_NAVIGATIONS = InfrastructureNavigations
    
  return (
    <div>
        <SecondaryHeader links={INFRASTRUCTURES_NAVIGATIONS} />

        <div className='p-6'>
            {children}
        </div>
    </div>
  )
}

export default InfrastructuresLayout