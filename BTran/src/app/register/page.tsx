"use client"
import { SyntheticEvent, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'


export default function Register() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [regProgress, setRegProgress] = useState(false);
    const [countdown, setCountdown] = useState(4);
    const router = useRouter();

    var message = 'Some information is missed or wrong, please try again'
    useEffect(() => {
        let countdownTimer;

        if (regProgress) {
            countdownTimer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        return () => {
            clearInterval(countdownTimer);
        };
    }, [regProgress]);
    
    useEffect(() => {
        if (countdown === 0) {
            setRegProgress(false);
            setCountdown(4); 
        }
    }, [countdown]);

    async function handleFormSubmit(ev: SyntheticEvent) {
        ev.preventDefault()
        const response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({ phone, password, name, method: 'add' }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
            setError(true)
            console.log(response.ok)
        }
        else {
            setError(false)
            setRegProgress(true)
            router.push('/')
        }
    }

    return (
            <div className="flex gap-6 justify-center">
                <div className="w-2/3">
                    <div className="mb-4 pb-4 font-poppins font-bold text-5xl border-b-2 border-black mt-20">
                        Register
                    </div>
                    <div className="bg-white h-4/6 justify-center items-center mt-16">
                        <form className="m-9 pt-4 block max-w-xl mx-auto">
                            <div className="font-semibold mt-7">Phone Number</div>
                            <input className="block w-full bg-gray-200 px-4 py-2 rounded-lg mb-4" type="phone" placeholder="phone" value={phone}
                                onChange={ev => setPhone(ev.target.value)} />
                            <div className="font-semibold">Password</div>
                            <input className="block w-full bg-gray-200 px-4 py-2 rounded-lg mb-4" type="password" placeholder="password" value={password}
                                onChange={ev => setPassword(ev.target.value)} />
                            <div className="font-semibold">Full name</div>
                            <input className="block w-full bg-gray-200 px-4 py-2 rounded-lg mb-4" type="text" placeholder="name" value={name}
                                onChange={ev => setName(ev.target.value)} />
                            {(error) &&
                                <div className="p-3 bg-red-200 text-red-800 font-bold my-3 rounded-lg">
                                    {message}
                                </div>
                            }
                            {(regProgress) &&
                                <div className="p-3 bg-lime-400 text-white font-bold my-3 rounded-lg">
                                    Register completed. Closing in {countdown} seconds...
                                </div>
                            }

                            <button disabled={regProgress}
                                className="bg-[#7ce0ff] py-2 px-2 w-full font-bold rounded-lg hover:bg-[#bbefff] hover:text-white transition-colors duration-300"
                                type="submit" onClick={handleFormSubmit}>Add user</button>
                        </form>
                    </div>
                </div>
            </div>
    )
}