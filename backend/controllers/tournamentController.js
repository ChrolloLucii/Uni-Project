let tournamentService // Будет проинициализирован через DI

export function setTournamentService(service) { 
	tournamentService = service // Принимаем сервис турниров
}

export async function createTournament(req, res) {
	try {
		const user = req.user // Пользователь из мидлвари   
		const data = req.body // Данные турнира из тела запроса

		const tournament = await tournamentService.createTournament(data, user)
		res.status(201).json(tournament) // Отправляем созданный турнир
	} catch (error) {
		res.status(400).json({ error: error.message }) // Отправляем ошибку
	}
}
