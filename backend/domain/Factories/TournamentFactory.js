import Tournament from '../entities/Tournament.js'

export default class TournamentFactory{
    createTournament(data){
        return new Tournament({
            id : data.id,
            name : data.name,
            description : data.description || null,
            startDate : data.startDate,
            endDate : data.endDate || null,
            organizer : data.organizer || null,
            discipline : data.discipline,
            status : data.status ,
            teams : data.teams || [],
            matches : data.matches || []
            


        });

    }


}