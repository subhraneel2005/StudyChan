'use client'

import React from 'react'
import { Button } from './ui/button'
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar"
import MoileNav from './MoileNav'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  
    const router = useRouter();
  
    return (
    <main>
    <div className='w-full px-6 py-8 hidden lg:flex justify-evenly'>
        <span className='text-lg font-bold'>StudyChan .</span>
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Features</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Feature 1</MenubarItem>
                    <MenubarItem>Feature 2</MenubarItem>
                    <MenubarItem>Feature 3</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
                <MenubarTrigger>Github</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Repository</MenubarItem>
                    <MenubarItem>Issues</MenubarItem>
                    <MenubarItem>Pull Requests</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
                <MenubarTrigger>Contact us</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Email</MenubarItem>
                    <MenubarItem>Discord</MenubarItem>
                    <MenubarItem>Twitter</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
        <Button onClick={() => router.push('/signup')} size='sm'>Signin</Button>
    </div>
    <MoileNav/>
    </main>
  )
}