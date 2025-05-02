import React from 'react'

const Title = ({title_content = "Title content"}) => {
  return (
    <div>
        <h1 className='font-semibold text-2xl'>{title_content}</h1>
    </div>
  )
}

export default Title