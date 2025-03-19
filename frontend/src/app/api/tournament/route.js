import {NextResponse} from 'next/server';
import { getApiUrl } from '../../../../config/apiUrl';
export async function GET(request) {
    const backendUrl = getApiUrl(false);

    const res = await fetch(`${backendUrl}/api/tournaments`);
    if (!res.ok){
        return NextResponse.json({error: 'Error fetching tournaments'}, {status: res.status});
    }
    const tournaments = await res.json();
    return NextResponse.json(tournaments, {status: 200});
}

export async function POST(request) {
    const backendUrl = getApiUrl(false);
    const data = await request.json();
    const res = await fetch(`${backendUrl}/api/tournaments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const tournament = await res.json();
    return NextResponse.json(tournament, {status: 201});
}
