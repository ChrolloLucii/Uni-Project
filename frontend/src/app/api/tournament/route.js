import {NextResponse} from 'next/server';
export async function GET(request) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000' || 'http://example:4000';

    const res = await fetch(`${backendUrl}/api/tournaments`);
    if (!res.ok){
        return NextResponse.json({error: 'Error fetching tournaments'}, {status: res.status});
    }
    const tournaments = await res.json();
    return NextResponse.json(tournaments, {status: 200});
}

export async function POST(request) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000' || 'http://example:4000';

    const res = await fetch(`${backendUrl}/api/tournaments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.body),
    });

    const tournament = await res.json();
    return NextResponse.json(tournament, {status: 201});
}