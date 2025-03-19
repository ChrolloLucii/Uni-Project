import { NextResponse } from 'next/server';
import { getApiUrl } from '../../../../../../config/apiUrl';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = getApiUrl(false);
    const response = await fetch(`${backendUrl}/api/tournaments/${id}/generate-matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error generating tournament matches:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate tournament matches' },
      { status: 500 }
    );
  }
}