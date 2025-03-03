"use client"

import React, {useState} from 'react';

import {useParams } from 'next/navigation';

export default function GenerateMatchesButton({onMatchesGenerated}) {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    
    const handleGenerate = async () => {
        setLoading(true);
        try{
            const res = await fetch(`/api/tournament/${id}/generate`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });
        
            if(!res.ok){
                throw new Error(`Ошибка: ${res.status}`);
            }
            const updatedTournament = await res.json();
            onMatchesGenerated(updatedTournament.matches);
            alert("Сетка сгенерирована");
        }
        catch(error){
            console.error(error);
            alert("Ошибка при гененерации сетки")
        }
        setLoading(false);
    };
    return (
        <button
        onClick={handleGenerate}
        className="py-2 px-4 rounded text-white bg-gray-700"
        >{loading ? "Генерация..." : "Сгенерировать сетку"}
        </button>
    )

}