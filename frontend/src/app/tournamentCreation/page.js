"use client"
import React, {useState, useEffect} from "react"

export default function TournamentForm(){

    const [tournament, setTournament] = useState({
        name: "",
        startDate: "",
        discipline: "",
        status: "",
        teams: [],
        judges: []
    });


    const [ createdTournament, setCreatedTournament] = useState(null);
    const [newTeam, setNewTeam] = useState({id: "", name: "", rating: 0, players: []});
    const disciplines = ["dota2", "counterStrike2"];

    const handleTournamentChange = (e) => {
        const {name, value} = e.target;
        setTournament((prev) => ({
            ...prev,
            [name] : value
    }));

    };

    const handleTournamentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/tournament',{
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(tournament)
            });
            if (!res.ok){
                throw new Error(`ошибка: ${res.status}`);
            }
            const data = await res.json();
            console.log("Турнир создан", data);
            setCreatedTournament(data);
            alert("Турнир создан");
        }
        catch(error){
            console.error(error);
            alert("Что-то пошло не так(разбирайся сам)");
        }
    };
        const handleTeamChange = (e) => {
            const {name, value} = e.target;
            setNewTeam((prev) =>({
                ...prev,
                [name]: value
            }));
    };

        const handleAddTeam = async (e) =>{
            e.preventDefault();
            if (!createdTournament || !createdTournament.id){
                alert("Сначала создайте турнир");
                return;
            }
        try{
            const res = await fetch(`http://localhost:4000/api/tournaments/${createdTournament.id}/teams`,
                {
                    method: "POST",
                    headers: 
                    {"content-type" : "application/json"},
                    body: JSON.stringify(newTeam)
                }
            );
            if (!res.ok){
                throw new Error(`ошибка: ${res.status}`);
            }
            const updatedTournament = await res.json();
            console.log("Команда Добавлена", updatedTournament);
            setCreatedTournament(updatedTournament);
            setNewTeam({id : "", name: "", rating: "", players: []});
        } catch(error){
            console.error(error);
            alert("Что-то пошло не так(разбирайся сам)");
        
        }
    };


    return (
        <div>
            {!createdTournament && (
                <form className ="text-white" onSubmit ={handleTournamentSubmit}>
                    <h2 className=" text-2xl mb-4 text-white>">Создать турнир </h2>
                    <div className= "mb-4">
                        <label className = "block mb-1 text-white" htmlFor="name"> Название</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={tournament.name}
                        onChange={handleTournamentChange}
                        className="border bg-gray-700 w-full rounded p-2"
                        required
                        />
                    </div>
                    <div className = "mb-4">
                    <label className="block mb-1 text-white" htmlFor="startDate">Дата начала</label>
                    <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={tournament.startDate}
                            onChange={handleTournamentChange}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            required
                            />
                    </div>
                    <div className="mb-4">
                    <label className="block mb-1 text-white" htmlFor="discipline">Дисциплина</label>
                    <select
                        id="discipline"
                        name="discipline"
                        value={tournament.discipline}
                        onChange={handleTournamentChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        required
                        >
                        <option value="">Выберите дисциплину</option>
                        {disciplines.map((item, index) => (
                            <option key={index} value={item}>
                            {item}
                            </option>
                        ))}
                        </select>

                    </div>

                    <button type = "submit" className ="py-2 px-4 rounded text-white">
                        Создать турнир
                    </button>

                </form>
            )}
            {createdTournament && (
                <div className ="mt-8">
                    <h2 className = "text-2xl mb-4 text-white"> Добавить команду в турнир {createdTournament.name} </h2>
                    
                    <form className="mb-4" onSubmit={handleAddTeam}>
                        <div className ="mb-4">
                            <label className="block mb-1 text-white" htmlFor="id"> id</label>
                            <input
                            type="text"
                            id="id"
                            name="id"
                            value={newTeam.id}
                            onChange={handleTeamChange}
                            className="border border-gray-300 rounded p-2"
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
                            className="border border-gray-300 rounded p-2"
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
                            className="border border-gray-300 rounded p-2"
                            required
                            />

                        </div>
                        <button type="submit" className="w-full py-2 px-4 rounded text-white bg-gray-700">
                        Добавить команду
                        </button>

                    </form>
                    
                    {createdTournament.teams && createdTournament.teams.length > 0 && (
                        <div>
                            <h2 className="text-2xl mb-4 text-white">Команды</h2>
                            <ul>
                                {createdTournament.teams.map((team, index) => (
                                    <li key={index} className="text-white">
                                        {team.name} - {team.rating}
                                    </li>
                                ))}
                            </ul>
                        </div>
            )}
    </div>
            )}
            </div>
  );
}