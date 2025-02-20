import { Router } from 'express'
import { createTournament } from '../controllers/tournamentController.js'

const router = Router() // Инициализация маршрутизатора

// Маршрут для создания турнира
router.post('/tournaments', createTournament) // Обработчик createTournament будет вызван при POST-запросе на /tournaments 

export default router
