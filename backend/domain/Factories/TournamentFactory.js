import Tournament from '../entities/Tournament.js'

export default class TournamentFactory{
    createTournament(data){
        if (!data || typeof data !== 'object') {
            throw new Error('Tournament data is required');
        }
        return new Tournament({
            id : data.id,
            name : data.name,
            description : data.description || null,
            startDate : data.startDate || new Date().toISOString(),
            endDate : data.endDate || null,
            organizer : data.organizer || null,
            discipline : data.discipline || "Unknown",
            status : data.status || "upcoming",
            teams : data.teams || [],
            matches : data.matches || []
            
        });
    }
}