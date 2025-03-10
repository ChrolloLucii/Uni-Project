import axios from 'axios'
import https from 'https'
import querystring from 'querystring'
import { v4 as uuidv4 } from 'uuid' 

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
    async _getAccessToken() {
        try {
         
            if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
                console.log('Используем существующий токен доступа')
                return this.accessToken
            }
    
            console.log('Получаем новый токен доступа...')
            
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            })
            
       
            const data = querystring.stringify({
                scope: 'GIGACHAT_API_PERS'
            })
            
       
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
          
            const expiresInMs = (response.data.expires_in || 1800) * 1000 
            this.tokenExpiry = Date.now() + expiresInMs - 60000 
            
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
    _checkIfTournamentQuestion(message) {
        const lowerMsg = message.toLowerCase()
        const keywords = [
            'турнир', 'команд', 'team', 'rating', 'рейтинг', 'победител', 
            'winner', 'чемпион', 'выиграл', 'проиграл', 'лучш', 'сильн', 
            'mmr', 'best', 'top', 'лидер'
        ]
        return keywords.some(keyword => lowerMsg.includes(keyword))
    }

    async _buildContextForGigaChat(userQuestion) {
        try {
            console.log('Запрашиваем данные из репозитория турниров...')
            const tournaments = await this.tournamentRepository.getAll() 
            console.log(`Получено ${tournaments ? tournaments.length : 0} турниров`)
            
            if (!tournaments || tournaments.length === 0) {
                return `Вопрос пользователя: "${userQuestion}"\n\nК сожалению, данные о турнирах недоступны.`
            }
            
            let allTeams = []
            for (const t of tournaments) {
                if (Array.isArray(t.teams)) {
                    allTeams = allTeams.concat(t.teams)
                }
            }
            
            let teamsInfo = 'Список команд (имя - рейтинг):\n'
            for (const team of allTeams) {
                if (team && team.name && team.rating !== undefined) {
                    teamsInfo += `${team.name} - ${team.rating}\n`
                }
            }
            
    
            let winnersInfo = 'Информация о завершенных турнирах:\n'
            
            for (const tournament of tournaments) {
                if (!tournament || !tournament.name) continue
                
     
                const lastRoundMatches = tournament.matches?.filter(match => 
                    match && match.round === tournament.rounds && match.winner
                ) || []
                
                if (lastRoundMatches.length > 0) {
                    const finalMatch = lastRoundMatches[0]
                    winnersInfo += `Турнир "${tournament.name}": победитель - ${finalMatch.winner.name} (рейтинг: ${finalMatch.winner.rating})\n`
                } else if (tournament.status === 'IN_PROGRESS') {
                    winnersInfo += `Турнир "${tournament.name}": в процессе\n`
                } else {
                    winnersInfo += `Турнир "${tournament.name}": победитель не определен\n`
                }
            }
            
     
            let predictionsInfo = 'Прогноз результатов по рейтингу MMR команд:\n'
            for (const tournament of tournaments) {
                if (!tournament || !tournament.name || !Array.isArray(tournament.teams) || tournament.teams.length === 0) continue
                
                if (tournament.status !== 'COMPLETED') {

                    const sortedTeams = [...tournament.teams]
                        .filter(team => team && team.rating !== undefined)
                        .sort((a, b) => b.rating - a.rating)
                    
                    if (sortedTeams.length > 0) {
                        const favoriteTeam = sortedTeams[0]
                        predictionsInfo += `Турнир "${tournament.name}": фаворит - ${favoriteTeam.name} (рейтинг: ${favoriteTeam.rating})\n`
                        
                        if (sortedTeams.length > 1) {
                            const secondTeam = sortedTeams[1]
                            predictionsInfo += `  Второй по силе - ${secondTeam.name} (рейтинг: ${secondTeam.rating})\n`
                        }
                    }
                }
            }
            

            const topTeams = [...allTeams]
                .filter(team => team && team.name && team.rating !== undefined)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
            
            let topTeamsInfo = 'Топ команды по рейтингу MMR:\n'
            topTeams.forEach((team, index) => {
                topTeamsInfo += `${index + 1}. ${team.name} - ${team.rating}\n`
            })
    
            const prompt = `
    Вопрос пользователя: "${userQuestion}"
    
    У тебя есть следующие данные:
    
    1. ${teamsInfo}
    
    2. ${winnersInfo}
    
    3. ${predictionsInfo}
    
    4. ${topTeamsInfo}
    
    ВАЖНО: Чем выше рейтинг (MMR) команды, тем она сильнее. Рейтинг напрямую отражает силу и качество команды.
    В незавершенных турнирах наиболее вероятным победителем считается команда с самым высоким рейтингом.
    Победителем турнира считается команда, выигравшая матчи последнего раунда.
    
    Ответь на вопрос пользователя, опираясь на эти данные. Если спрашивают о лучших командах или о фаворитах - это всегда команды с самым высоким MMR.
    Если данных не хватает, делай прогноз на основе MMR команд.
    `.trim()
    
            console.log('Контекст для GigaChat успешно сформирован')
            return prompt
            
        } catch (error) {
            console.error('Ошибка при формировании контекста:', error)
            return `Вопрос пользователя: "${userQuestion}"\n\nПроизошла ошибка при обработке данных: ${error.message}`
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
                        { 
                            role: "system", 
                            content: "Ты - ассистент по турнирам и командам. Ты понимаешь, что команды с более высоким рейтингом (MMR) считаются более сильными и лучшими." 
                        },
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