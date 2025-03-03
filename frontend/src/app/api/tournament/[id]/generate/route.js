import {NextResponse} from 'next/server';


export async function POST(request, {params}) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000' || 'http://example:4000';
    const { id } = params;
    const tournamentId = parseInt(id, 10);
    
    try{
    const res = await fetch(`${backendUrl}/api/tournaments/${tournamentId}/generate-matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        return NextResponse.json({error: 'Error generating matches'}, {status: res.status});
    }
    
    const data = await res.json();
    return NextResponse.json(data, {status: 200});
    }
    catch(error){
        console.error("Error generating matches", error);
        return NextResponse.json({error: 'Error generating matches'}, {status: 500});
    }
}