import CreateTournamentButton from "./CreateTournamentButton"
import TournamentTable from "./tournamentTable";
export default function Body(){
    const tournaments = [
        {
        id: 1,
        name: "Турнир 1",
        date: "2022-03-02",
        organizer: "Организатор 1",
        discipline: "Дисциплина 1",
        status: "Статус 1"

    },
    {  
        id: 2,
        name: "Турнир 2",
        date: "2022-03-02",
        organizer: "Организатор 2",
        discipline: "Дисциплина 2",
        status: "Статус 2"
    },
];
return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center px-[18%] bg-clip-content">
      <div className="w-full max-w-6xl px-4  py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-[#f44e1c]">Турниры</h1>
          <CreateTournamentButton/>
        </div>
        <TournamentTable tournaments={tournaments} />
      </div>
    </div>
  );
};