"use client"
import React, {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
export default function TournamentForm(){
    const router = useRouter();
    const [tournament, setTournament] = useState({
        name: "",
        startDate: "",
        discipline: "",
        startDate: "",
        endDate: "",
        status: "",
        teams: [],
        judges: []
    });
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
            alert("Турнир создан");
            router.push(`/tournament/${data.id}/manage`);
        }
        catch(error){
            console.error(error);
            alert("Что-то пошло не так(разбирайся сам)");
        }
      };


    return (
        <div>
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
                    <div className="mb-4">
              <label className="block mb-1" htmlFor="endDate">
                Дата окончания
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={tournament.endDate}
                onChange={handleTournamentChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
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
        </div>
    );
}