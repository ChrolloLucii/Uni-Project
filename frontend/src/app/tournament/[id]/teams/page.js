"use client"
import React, {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';

export default function AddTeamForm(){

    const {id} = useParams();
    const [newTeam, setNewTeam] = useState({id: "", name: "", rating: "", players: []});
    const [teams, setTeams] = useState([]);


    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const res = await fetch (`http://localhost:4000/api/tournaments/${id}/teams`);
                if (!res.ok){
                    throw new Error(`ошибка: ${res.status}`);
                }
                const data = await res.json();
                setTeams(Array.isArray(data) ? data : data.teams || []);
            }
            catch(error){
                console.log(error)
            }
        }
        fetchTournament();

    }, [id]);

const handleTeamChange = (e) => {
    const {name, value} = e.target;
    setNewTeam((prev) =>({
        ...prev,
        [name]: value
    }));
};

const handleAddTeam = async (e) =>{
    e.preventDefault();
    console.log("Отправляем данные команды:", newTeam);
try{
    const res = await fetch(`http://localhost:4000/api/tournaments/${id}/teams`,
        {
            method: "POST",
            headers: 
            {"content-type" : "application/json"},
            body: JSON.stringify({
            id: newTeam.id,
            name: newTeam.name,
            rating: Number(newTeam.rating)})
        }
    );
    if (!res.ok){
        throw new Error(`ошибка: ${res.status}`);
    }
    const updatedTournament = await res.json();
    console.log("Команда Добавлена", updatedTournament);
    setTeams(updatedTournament.teams || []);
    setNewTeam({id : "", name: "", rating: "", players: []});

    alert("Команда добавлена");
} catch(error){
    console.error(error);
    alert("Что-то пошло не так(разбирайся сам)");
}
};
return (
                <div className ="mt-8">
                    <h2 className = "text-2xl mb-4 text-white"> Добавить команду в турнир {id} </h2>
                    
                    <form className="mb-4" onSubmit={handleAddTeam}>
                        <div className ="mb-4">
                            <label className="block mb-1 text-white" htmlFor="id"> id</label>
                            <input
                            type="text"
                            id="id"
                            name="id"
                            value={newTeam.id}
                            onChange={handleTeamChange}
                            className="border border-gray-300 text-black rounded p-2"
                            required
                            />

                        </div>
                        <div className ="mb-4">
                            <label className="block mb-1 text-white" htmlFor="name"> Название</label>
                            <input
                            type="text"
                            id="name"
                            name="name"
                            value={newTeam.name}
                            onChange={handleTeamChange}
                            className="border border-gray-300 text-black rounded p-2"
                            required
                            />
                        </div>
                        <div className ="mb-4">
                            <label className="block mb-1 text-white" htmlFor="rating"> Аверага</label>
                            <input
                            type="text"
                            id="rating"
                            name="rating"
                            value={newTeam.rating}
                            onChange={handleTeamChange}
                            className="border border-gray-300 rounded text-black p-2"
                            required
                            />

                        </div>
                        <button type="submit" className="w-full py-2 px-4 rounded text-white bg-gray-700">
                        Добавить команду
                        </button>

                    </form>
                    
                {teams.length > 0 && (
                    
                        <div>
                            <h2 className="text-2xl mb-4 text-white">Команды</h2>
                            <ul>
                            {teams.map((team) => (
              <li key={team.id}>
                {team.name} (ID: {team.id}, MMR: {team.rating})
              </li>
            ))}
                            </ul>
                        </div>
                )}            
            </div>
)};