"use client"
import React from 'react';
import Image from 'next/image';
export default function TournamentTable({tournaments}){
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
                    <div className="col-span-2 text-2xl">{tournament.name}</div>
                    <div className="col-span-2 text-2xl">{tournament.date}</div>
                    <div className="col-span-2 text-2xl">{tournament.organizer}</div>
                    <div className="col-span-2 text-2xl">{tournament.discipline}</div>
                    <div className="col-span-2 text-2xl">{tournament.status}</div>
                    <div className="col-span-2 text-2xl">
                        <button className="flex items-center justify-center text-white rounded-lg h-full">
                            <Image src="/gear-option-preference-svgrepo-com.svg" alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}