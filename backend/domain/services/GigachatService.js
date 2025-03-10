import axios from 'axios'
import https from 'https'
import querystring from 'querystring'
import { v4 as uuidv4 } from 'uuid' // Нужно добавить зависимость

export default class GigachatService {
    constructor(tournamentRepository, gigachatApiKey) {
        this.tournamentRepository = tournamentRepository
        this.gigachatApiKey = gigachatApiKey
        this.accessToken = null
        this.tokenExpiry = null
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
	async _getAccessToken() {
        try {
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            })

            // Проверяем, есть ли у нас действующий токен
            if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
                return this.accessToken
            }

            console.log('Получаем новый токен доступа...')
            
            // Используем querystring для правильного форматирования данных
            const data = querystring.stringify({
                scope: 'GIGACHAT_API_PERS'
            })
            
            // Генерируем уникальный идентификатор для запроса
            const rqUID = uuidv4()
            
            const response = await axios.post(
                'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
                data,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'RqUID': rqUID,
                        'Authorization': `Basic ${this.gigachatApiKey}`
                    },
                    httpsAgent
                }
            )

            this.accessToken = response.data.access_token
            // Устанавливаем время жизни токена (с небольшим запасом)
            const expiresInMs = (response.data.expires_in || 1800) * 1000 // По документации 30 минут (1800 секунд)
            this.tokenExpiry = Date.now() + expiresInMs - 60000 // Вычитаем минуту для надежности
            
            console.log('Токен доступа успешно получен')
            return this.accessToken
        } catch (error) {
            console.error('Ошибка при получении токена:', error.message)
            if (error.response) {
                console.error('Response data:', error.response.data)
                console.error('Response status:', error.response.status)
            }
            throw new Error('Не удалось получить токен доступа для GigaChat API')
        }
    }

    async _callGigachatApi(prompt) {
        try {
            // Получаем актуальный токен доступа
            const accessToken = await this._getAccessToken()
            
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false, 
            })
            
            const response = await axios.post(
                'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
                {
                    model: "GigaChat:latest",
                    messages: [
                        { role: "system", content: "Ты - ассистент по турнирам и командам." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    httpsAgent,
                }
            )
            
            const text = response.data?.choices?.[0]?.message?.content
            return text || 'Извините, GigaChat не смог сформировать ответ.'
        } catch (err) {
            console.error('GigaChat API error:', err.message)
            if (err.response) {
                console.error('Response data:', err.response.data)
                console.error('Response status:', err.response.status)
            }
            return 'Произошла ошибка при обращении к GigaChat.'
        }
    }
}