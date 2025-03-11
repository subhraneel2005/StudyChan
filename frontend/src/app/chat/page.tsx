import AiInput from '@/components/ui/ai-input'
import React from 'react'

export default function page() {
  return (
    <div className='min-h-screen w-full justify-center items-center flex flex-col tracking-tighter px-3'>
        <h1 className='font-bold text-4xl md:text-5xl'>Hi I'm <i className='font-black'>StudyChan</i></h1>
        <p className='text-lg text-muted-foreground mt-2'>What do you want to learn today?</p>

        <AiInput/>
    </div>
)
}
