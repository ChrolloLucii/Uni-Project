import axios from 'axios'
import https from 'https'
export default class GigachatService {
	constructor(tournamentRepository, gigachatApiKey) {
		this.tournamentRepository = tournamentRepository
		this.gigachatApiKey = gigachatApiKey 
	}

	/**
	 * Обрабатывает сообщение (вопрос) от пользователя.
	 * 1. Проверяет, относится ли вопрос к теме турниров.
	 * 2. Если нет — сразу отказывает.
	 * 3. Если да — собирает данные и вызывает GigaChat API.
	 */
	async handleMessage(message) {
		const isTournamentQuestion = this._checkIfTournamentQuestion(message)
		if (!isTournamentQuestion) {
			return 'Извините, я не могу ответить на этот вопрос.'
		}
		const context = await this._buildContextForGigaChat(message)
		const response = await this._callGigachatApi(context)
		return response
	}

	_checkIfTournamentQuestion(message) {
		const lowerMsg = message.toLowerCase()
		const keywords = ['турнир', 'команд', 'team', 'rating', 'рейтинг']
		return keywords.some(keyword => lowerMsg.includes(keyword))
	}

	async _buildContextForGigaChat(userQuestion) {
		const tournaments = await this.tournamentRepository.getAll() 
		let allTeams = []
		for (const t of tournaments) {
			if (Array.isArray(t.teams)) {
				allTeams = allTeams.concat(t.teams)
			}
		}
		let teamsInfo = 'Список команд (имя - рейтинг):\n'
		for (const team of allTeams) {
			teamsInfo += `${team.name} - ${team.rating}\n`
		}

		const prompt = `
Вопрос пользователя: "${userQuestion}"
У тебя есть данные о командах и их рейтингах:
${teamsInfo}
Ответь на вопрос, учитывая эти данные. Если данных не хватает, напиши, что данных недостаточно.
    `.trim()
		return prompt
	}

	async _callGigachatApi(prompt) {
		try {
            const httpsAgent = new https.Agent({
							rejectUnauthorized: false, 
						})
			const response = await axios.post(
				'https://gigachat.devices.sberbank.ru/api/v1/models',
				{
					prompt: prompt,
					max_tokens: 500,
				},
				{
					headers: {
						Authorization: `Bearer ${this.gigachatApiKey}`,
						Accept: 'application/json',
					},
					httpsAgent,
				}
			)
			const text = response.data?.choices?.[0]?.text
			return text || 'Извините, GigaChat не смог сформировать ответ.'
		} catch (err) {
			console.error('GigaChat API error:', err.message)
			return 'Произошла ошибка при обращении к GigaChat.'
		}
	}
}
