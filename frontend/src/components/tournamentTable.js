"use client"
import React from 'react';
import {useEffect, useState} from 'react';
import Image from 'next/image';



export default function TournamentTable(){
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tournament').
        then(async (res) => {
            if (!res.ok){
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
            }
            const text = await res.text();
            return text ? JSON.parse(text) : [];
        }).then((data) => {
            setTournaments(data);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }, [])
    if (loading) return <p> Loading...</p>;
    if (!tournaments.length) return <p> No tournaments found</p>
    return (
        <div className="grid grid-cols-12 gap-4 p-4 rounded-lg">
            <div className="col-span-2 text-3xl text-white">Название</div>
            <div className="col-span-2 text-3xl text-white">Дата</div>
            <div className="col-span-2 text-3xl text-white">Организатор</div>
            <div className="col-span-2 text-3xl text-white">Дисциплина</div>
            <div className="col-span-2 text-3xl text-white">Статус</div>
            <div></div>
            {tournaments.map((tournament) => (
                <React.Fragment key={tournament.id}>
                    <div className="col-span-2 text-2xl flex items-center">{tournament.name}</div>
                    <div className="col-span-2 text-2xl flex items-center justify-center">{tournament.startDate}</div>
                    <div className="col-span-2 text-2xl flex items-center justify-center">{tournament.judges.username}</div>
                    <div className="col-span-3 text-2xl flex items-center justify-center">{tournament.discipline}</div>
                    <div className="col-span-2 text-2xl flex items-center justify-center">{tournament.status}</div>
                    <div className="col-span-1 text-2xl">
                        <button className="flex items-center justify-center text-white rounded-lg h-full">
                            <Image src="/gear-option-preference-svgrepo-com.svg" alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}