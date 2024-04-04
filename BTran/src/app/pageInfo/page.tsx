"use client"

import { useEffect, useState, useRef, SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import 'reactjs-popup/dist/index'

export default function Info() {
    const [user, setUser] = useState({})
    const router = useRouter();;

    useEffect(() => {
        localStorage.setItem('sidebar', 0)
        const response = fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: localStorage.getItem('userName'), method: 'getInfo' }),
        })
            .then(response => response.json())
            .then(data => {
                setUser(data)
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="flex gap-6 justify-center">
            <div className="w-2/3">
                <div className="flex justify-center items-center font-bold text-5xl text-[#50BFE2] mt-24">
                    User Information
                </div>
                <div className="bg-white h-96 justify-center items-center mt-16">
                    <form className="m-9 pt-4 block max-w-xl mx-auto">
                        <div className="font-semibold mt-16">Phone Number:</div>
                        <div className="block w-full bg-gray-200 px-4 py-2 rounded-lg mb-4">
                            <span>{user.phone}</span>
                        </div>
                        <div className="font-semibold mt-9">Full name:</div>
                        <div className="block w-full bg-gray-200 px-4 py-2 rounded-lg mb-4">
                            <span>{user.name}</span>
                        </div>
                    </form>
                    <Link href={"/"}>
                        <p className='text-center text-black text-lg font-semibold hover:text-red-600 mt-14'>Sign out</p>
                    </Link>
                </div>
            </div>
            
        </div>
        
    )
}
