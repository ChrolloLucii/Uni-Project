"use client"
import React from 'react';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import TournamentActions from './TournamentActions';
import {useRouter} from 'next/navigation';


export default function TournamentTable(){
    const router = useRouter();
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
    }, []);


    if (loading) return <p> Loading...</p>;
    if (!tournaments.length) return <p> No tournaments found</p>

    const handleDeleteTournament = async (tournamentId) => {
        if (confirm("Вы уверены, что хотите удалить турнир?")) {
          try {
            const res = await fetch(`/api/tournament/${tournamentId}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              throw new Error(`Ошибка: ${res.status}`);
            }
            // Обновляем список турниров, удаляя удалённый элемент
            setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
            alert("Турнир удалён");
          } catch (error) {
            console.error(error);
            alert("Ошибка при удалении турнира");
          }
        }
      };
      const handleManageTournament = (tournamentId) => {
        router.push(`/tournament/${tournamentId}/manage`);
      };
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
          <div className="col-span-2 text-2xl flex items-center justify-center">
            {tournament.judges && tournament.judges.username}
          </div>
          <div className="col-span-3 text-2xl flex items-center justify-center">{tournament.discipline}</div>
          <div className="col-span-2 text-2xl flex items-center justify-center">{tournament.status}</div>
          <div className="col-span-1 text-2xl">
            <TournamentActions
              tournament={tournament}
              onDelete={handleDeleteTournament}
              onManage={handleManageTournament}
            />
          </div>
                </React.Fragment>
            ))}
        </div>
    );
}