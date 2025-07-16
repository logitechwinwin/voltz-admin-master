'use client'
import { TransactionHistory } from '@/component'
import React from 'react'

const page = ({params}) => {
    const type = params?.slug
  return (
    <TransactionHistory type={type}/>
  )
}

export default page