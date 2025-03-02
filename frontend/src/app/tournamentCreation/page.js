"use client"
import React, {useState, useEffect} from "react"

export default function TournamentForm(){

    const [tournament, setTournament] = useState({
        id : "",
        name: "",
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
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setTournament((prev) =>({
            ...prev,
            [name] : value
        }));


        };

        const handleSubmit = async (e) => {
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
    return (<form className ="text-black" onSubmit = {handleSubmit}>
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
    <div className="mb-4">
        <label className="block mb-1 text-white" htmlFor="startDate">
          Дата начала
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={tournament.startDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          required
        />
      </div>
      <div>

      </div>
      <div className="mb-4">
        <label className="block mb-1 text-white" htmlFor="discipline">
          Дисциплина
        </label>
        <select
          id="discipline"
          name="discipline"
          value={tournament.discipline}
          onChange={handleChange}
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
    
      <button
        type="submit"
        className="w-full py-2 px-4 rounded text-white"
      > Создать турнир
      </button>
    </form>
  );
}