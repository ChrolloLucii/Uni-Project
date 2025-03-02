"use client"
import React, {useState, useEffect} from "react"

export default function TournamentForm(){

    const [tournament, setTournament] = useState({
        id : "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        organizer: "",
        discipline: "",
        status: "",
        teams: [],
        matches: [],
        previousMatches: [],
        judges: []
    });

    const disciplines = ["dota2", "counterStrike2"];
    const statuses = ["upcoming", "ongoing", "finished"];
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setTournament((prev) =>({
            ...prev,
            [name] : value
        }));


        };

        const handleSubmit = async (e) => {
            e.preentDefault();
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
                setTournament({
                    name: "",
                    startDate: "",
                    discipline: "",
                    status: "",
                    organizer: "",
                    judges : [],
                });
                alert ("Турнир создан");
            }
            catch(error){
                console.error(error);
                alert('Something went wrong');
            }

    };
    return <form className ="text-black" onSubmit = {handleSubmit}>
        <h2 className = "text-2xl mb-4 text-white">Создать турнир</h2>
    <div className = "mb-4">
        <label className = "block mb-1 text-white" htmlFor="name">Название</label>
        <input 
        type = "text"
        id = "name"
        name = "name"
        value = {tournament.name}
        onChange = {handleChange}
        className = "w-full border border-gray-300 rounded p-2"
        required
        />
    </div>


</form>
}