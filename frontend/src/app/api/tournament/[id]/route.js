import { NextResponse } from "next/server";
import { getApiUrl } from '../../../../../config/apiUrl';
export async function DELETE(request, { params }) {
    const backendUrl = getApiUrl(false);
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