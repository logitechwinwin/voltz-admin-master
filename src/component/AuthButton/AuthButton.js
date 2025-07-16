import React from 'react'

import { Button } from '@mui/material'

const AuthButton = ({ title }) => {
    return (
        <Button variant='contained' sx={{ borderRadius: 3, textTransform: 'capitalize' }} size="large">{title}</Button>
    )
}

export default AuthButton
