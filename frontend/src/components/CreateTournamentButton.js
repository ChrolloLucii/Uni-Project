"use client";
import React, {useState, useEffect} from 'react';
import { hasOrganizerAccess } from '@/utils/authUtil';
export default function CreateTournamentButton() {
    const [canCreateTournament, setCanCreateTournament] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && hasOrganizerAccess(token)){
            setCanCreateTournament(true);
        }
    }, [])
    if (!canCreateTournament){
        return null;
    }
    return (
        <button>Создать турнир</button>
    )
}