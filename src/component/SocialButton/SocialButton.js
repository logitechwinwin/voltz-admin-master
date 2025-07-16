import React from 'react'

import { Button, Stack, Typography } from '@mui/material'
import Image from 'next/image'

const SocialButton = ({ src, title }) => {
    return (
        <Stack
            direction={'row'}
            gap={2}
            border='1px solid black'
            borderRadius={10}
            justifyContent="center"
            alignItems="center"
            p={1}
            component={Button}>
            <Image
                src={src}
                style={{
                    width: '21px',
                    height: '21px'
                }}
            />
            <Typography textTransform="capitalize" fontWeight={'bold'} fontSize={'16px'} color="black">{title}</Typography>
        </Stack>
    )
}

export default SocialButton
