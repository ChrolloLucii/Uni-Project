import express from 'express'
import teamController from '../controllers/teamController.js'
const teamRouter = express.Router()

// Маршрут для регистрации новой команды
teamRouter.post('/', teamController.registration)

// Маршрут для получения команды по id
teamRouter.get('/:id', teamController.getTeamById)

// Маршрут для получения списка всех команд
teamRouter.get('/t', teamController.getAllTeams)

// Маршрут для обновления данных команды
teamRouter.put('/', teamController.updateTeam)

// Маршрут для удаления команды по id
teamRouter.delete('/:id', teamController.deleteTeam)

export default teamRouter
