import {NextResponse} from 'next/server';
import { getApiUrl } from '../../../../config/apiUrl';
export async function POST(request) {
    try {
        const authPayload = await request.json();
        const backendUrl = getApiUrl(false);
        const response = await fetch(`${backendUrl}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authPayload),
        }
        );
        
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, {status: response.status});
        }
        const res = NextResponse.json(data);
        res.cookies.set('token', data.token, {
            //Добавить secure 
            httpOnly: true,
            path: '/',
            maxAge : 60*60
    });
    return res;
}
    catch (error){ 
        return NextResponse.json({error: error.message}, {status: 500});
    }
}