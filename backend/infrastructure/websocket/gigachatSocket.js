import { Server } from 'socket.io'

export function initGigachatSocket(httpServer, gigachatService) {
	const io = new Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	})

	const gigachatNamespace = io.of('/gigachat')

	gigachatNamespace.on('connection', socket => {
		console.log('GigaChat client connected:', socket.id)

		socket.on('message', async msg => {
			try {
				const reply = await gigachatService.handleMessage(msg)
				socket.emit('message', reply)
			} catch (err) {
				socket.emit('message', 'Ошибка: ' + err.message)
			}
		})

		socket.on('disconnect', () => {
			console.log('GigaChat client disconnected:', socket.id)
		})
	})
}
