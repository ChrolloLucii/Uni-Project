import {NextResponse} from 'next/server';

export async function POST(request){
    try{
    const registerPayload = await request.json();
    const backendUrl = getApiUrl(true);
    const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload),
    });
    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
}
    catch(error){
        return NextResponse.json({error: error.message}, {status: 500});


    }
}