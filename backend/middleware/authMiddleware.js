import jwt from 'jsonwebtoken';

// Используем тот же секретный ключ, что и для токенов приглашений
const secret = '12341234';

/**
 * Middleware для проверки JWT токена
 * Извлекает токен из заголовка Authorization или из куки
 */
export const authMiddleware = (req, res, next) => {
    try {
        // Получаем токен из заголовка или cookies
        const token = req.cookies?.token || 
                    (req.headers.authorization?.startsWith('Bearer ') ? 
                        req.headers.authorization.slice(7) : 
                        req.headers['x-access-token']);
        
        if (!token) {
            return res.status(401).json({ error: 'Отсутствует токен авторизации' });
        }
        
        try {
            // Верифицируем JWT
            const decoded = jwt.verify(token, secret);
            
            // Добавляем данные пользователя в объект запроса
            req.user = decoded;
            
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Неверный или просроченный токен авторизации' });
        }
    } catch (error) {
        console.error('Ошибка в authMiddleware:', error);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

/**
 * Middleware для проверки роли пользователя
 * @param {Array} roles - Массив допустимых ролей
 */
export const checkRole = (roles) => {
    return (req, res, next) => {
        // Проверяем наличие данных пользователя
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не авторизован' });
        }
        
        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ 
                error: 'Доступ запрещен', 
                message: `Требуется одна из ролей: ${roles.join(', ')}`
            });
        }
    };
};