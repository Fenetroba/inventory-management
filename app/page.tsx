"use client";
import Create_Product_Form from '@/src/components/Create_Product_Form'
import Fetch_data from '@/src/components/Fetch_Data'
import React, { useState } from 'react'

const page = () => {
  const [open, setopen] = useState(false)
  return (
    <section className='relative'>

      <div
        style={{ boxShadow: "20px 20px 60px #526044,-20px -20px 60px #70825c" }}
        className="mb-6 rounded-b-2xl h-16 bg-[#293a1d]"
      >
        
        <button onClick={() => setopen(!open)} className="absolute top-1 mt-2 left-2 border border-[var(--topNav)] p-2 text-sm rounded-[7px]">
          Create Product +
        </button>
      </div>
      <div className='flex w-full max-sm:'>
        <Create_Product_Form open={open} />
        <Fetch_data open={open} />
      </div>
    </section>
  )
}

export default page
