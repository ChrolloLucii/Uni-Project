import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000' || 'http://example:4000';
    const tournamentId  = parseInt(params.id,10);
    console.log("Удаляем турнир с id:", tournamentId);
    const res = await fetch(`${backendUrl}/api/tournaments/${tournamentId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        return NextResponse.json({ error: 'Error deleting tournament' }, { status: res.status });
    }
    return NextResponse.json({}, { status: 200 });
}