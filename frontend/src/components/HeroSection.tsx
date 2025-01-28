import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className='min-h-screen px-4 w-full flex flex-col lg:flex-row justify-center items-center p-2 -mt-[60px]'>
     <div className='flex flex-col'>
     <h1 className='text-2xl lg:text-5xl font-bold w-full lg:max-w-2xl'>Your AI-powered study buddy
     Upload notes and chat with them.</h1>
     <div className='mt-6'><Button>Get started <ArrowRight/></Button></div>
     </div>
      <Image height={400} width={400} src="/heroImg.png" alt='HeroImage' />
    </div>
  )
}
