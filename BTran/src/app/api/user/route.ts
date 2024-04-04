import { User } from "@/models/user"
import { connectToDatabase } from '../../../connection';

import * as CryptoJS from 'crypto-js';

// Hàm mã hóa AES
function encryptAES(text: string, key: string): string {
    return CryptoJS.AES.encrypt(text, key).toString();
}

// Hàm giải mã AES
function decryptAES(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export async function POST(req: { json: () => any }) {
    try{
        const body = await req.json()
        connectToDatabase();

        if(body.method === 'add'){
            const pass = body.password;
            if ((!pass?.length || pass.length < 5)) {
                return new Response(
                    JSON.stringify(
                        { ok: false, message: 'Invalid password' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 500,
                });
            }
            
            const exitUser = await User.findOne({phone: body.phone})
            if(exitUser){
                return new Response(
                    JSON.stringify(
                        { ok: false, message: 'Username already exists' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 500,
                });
            }
            
            const createdUser = await User.create({
                phone: body.phone,
                password: encryptAES(body.password, body.phone),
                name: body.name,
            })
            return Response.json(createdUser)
        }
        else if(body.method === 'check'){
            const userCheck = await User.findOne({ phone : body.phone });

            if (!userCheck) {
                return new Response(
                    JSON.stringify(
                        { ok: false, message: 'User not found' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 500,
                });
            }

            const passwordOk = (body.password == decryptAES(userCheck.password, body.phone));
            if (!passwordOk) {
                return new Response(
                    JSON.stringify(
                        { ok: false, message: 'Wrong password' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200,
                });
            }
            return Response.json({
                check: true,
                userFname: userCheck.name
            })
        }
        else if(body.method === 'getInfo'){
            const getUser = await User.findOne({phone: body.phone});
            return Response.json(getUser);
        }

    } catch (error) {
        return new Response(
            JSON.stringify(
                { ok: false, message: 'User fetching failed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}





