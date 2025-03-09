import jwt from 'jsonwebtoken';

// Мок authMiddleware
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key');
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Мок checkRole middleware
export const checkRole = (roles) => {
  return (req, res, next) => {
    // Проверяем, что у пользователя есть нужная роль
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};