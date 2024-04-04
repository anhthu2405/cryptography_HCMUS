'use client';

import Ilock from "@/icons/icon_lock"
import Iman from "@/icons/icon_man"
import { SyntheticEvent, useState } from "react"
import { useRouter } from 'next/navigation'
import Head from 'next/head';
import RootLayout from "./layout";

export default function Login() {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false);

    const router = useRouter();
    async function handleFormSubmit(ev: SyntheticEvent) {
        ev.preventDefault();
        var checkUser
        var userType
        var name
        await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password, method : 'check' }), 
        })
            .then(response => response.json())
            .then(data => {
                checkUser = data.check
                userType = data.userType
                name = data.userFname
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })

        if (checkUser) {
            localStorage.setItem('userName', phone)
            localStorage.setItem("userFname", name)
            setError(false);
            router.push('/pageInfo')
        }
        else {
            setError(true);
        }
    }

    const handleActionSignup = (link) => {
        router.push(link);
    };

    return (
        <RootLayout>
           <div className="mt-28 rounded-lg mx-auto my-auto w-2/3 h-[550px] bg-white border-gray-200 border-2">
    <div className="flex justify-center items-center h-full">
        <div className="w-1/2">
            <h1 className="flex justify-center items-center mt-0 font-bold text-5xl text-[#50BFE2]">
                Login
            </h1>
            <form onSubmit={handleFormSubmit}>
                <div className="font-mono mt-12 ml-6 mr-4 text-xl">
                    <div className="w-full p-2 inline-flex justify-center items-center border-2 border-solid rounded-md border-gray-100">
                        <Iman className="w-[21px] h-[24px] fill-[#D3CECE]" />
                        <input className="w-full h-8 ml-5 text-base font-semibold focus:outline-none"
                            type="phone" placeholder="Your telephone number"
                            name="Username" required value={phone}
                            onChange={ev => setPhone(ev.target.value)} />
                    </div>
                </div>

                <div className="font-mono mt-8 ml-6 mr-4 text-xl">
                    <div className="w-full p-2 inline-flex justify-center items-center border-2 border-solid rounded-md border-gray-100">
                        <Ilock className="w-[21px] h-[24px] fill-[#D3CECE]" />
                        <input className="w-full h-8 ml-5 text-base font-semibold focus:outline-none"
                            type="password" placeholder="Your password"
                            name="Password" required value={password}
                            onChange={ev => setPassword(ev.target.value)} />
                    </div>
                </div>
                {(error) &&
                    (
                        <div className="ml-6 mt-5 text-red-800 font-semibold 
                            bg-red-300 rounded-lg p-3 mr-5">
                            Wrong phone number or password
                        </div>
                    )
                }
                <div className="flex justify-center items-center mt-4">
                    <button
                        onClick={handleFormSubmit}
                        className="rounded-md my-4 w-36 h-11 p-1 pt-2 pb-2 font-bold text-xl font-poppins text-white
                                transition transform hover:scale-110 active:scale-100 bg-primary"
                        type="submit">Sign in</button>
                    <button
                        onClick={() => handleActionSignup('/register')}
                        className="rounded-md my-4 ml-8 w-36 h-11 p-1 pt-2 pb-2 font-bold text-xl font-poppins text-white
                                transition transform hover:scale-110 active:scale-100 bg-primary"
                        type="submit">Sign up</button>
                </div>
            </form>
        </div>
    </div>
</div>


        </RootLayout>
    )
}