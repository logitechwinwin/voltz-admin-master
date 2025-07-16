import { ArrowBackIosIcon } from '@/assets'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const BackButton = () => {
    const router = useRouter();
    return (
        <Button startIcon={< ArrowBackIosIcon />} sx={{ mb: 4 }} onClick={() => router.back()}>
            Back
        </Button>
    )
}

export default BackButton
