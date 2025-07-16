import React from 'react'

import { Typography } from '@mui/material'

const Heading = ({text}) => {
  return (
    <Typography variant='h4' fontWeight='bold'>{text}</Typography>
  )
}

export default Heading