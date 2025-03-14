import {NextResponse} from 'next/server';

export async function POST(request) {
    try {
        const authPayload = await request.json();
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000' || 'htpp:/example:4000';
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