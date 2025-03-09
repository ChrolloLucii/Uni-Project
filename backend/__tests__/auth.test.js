import request from 'supertest';
import app from '../testApp.js';
import sequelize from '../infrastructure/orm/sequelize.js';
import UserModel from '../infrastructure/models/userModel.js';
import bcrypt from 'bcrypt';
import InviteTokenModel from '../infrastructure/models/inviteTokenModel.js';
// Заготовка для первого теста (функция для форсированного создания организатора в базу (т.к организатор не может зарегистрироваться.))
async function createTestUser(userData) {
  // Хешируем пароль, чтобы он соответствовал реальному процессу
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return UserModel.create({
    ...userData,
    password: hashedPassword
  });
}

beforeAll(async () => {
  
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close();
});


beforeEach(async () => {
  await UserModel.destroy({ where: {} });
});
async function createInviteToken(organizerId) {
    return InviteTokenModel.create({
      token: 'test-token-' + Date.now(),
      organizerId,
      role: 'JUDGE',
      used: false
    });
  }
describe('Аутентификация и авторизация', () => {
  // Тест 1 и Тест 2: проверим успешный вход
  test('Успешная авторизация организатора', async () => {
    const userData = {
      username: 'testorganizer',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Test Organizer',
      email: 'test@example.com'
    };
    
    await createTestUser(userData);
    
    // Пытаемся выполнить вход
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });
    
    // Проверяем успешность входа
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user.username).toBe(userData.username);
    expect(loginResponse.body.user.role).toBe(userData.role);
  });

  // Тест 5: Неуспешная авторизация с неверным паролем
  test('Неуспешная авторизация с неверным паролем', async () => {
    // Создаем тестового пользователя напрямую в БД
    const userData = {
      username: 'wrongpassuser',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Wrong Password User',
      email: 'wrongpass@example.com'
    };
    
    await createTestUser(userData);
    
    // Пытаемся выполнить вход с неверным паролем
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: 'wrongpassword'
      });
    
    // Проверяем, что вход не выполнен
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).toHaveProperty('error');
  });

  // Тест 6: Доступ к защищенному маршруту с валидным токеном
  test('Доступ к защищенному маршруту с валидным токеном', async () => {
    // Создаем тестового организатора
    const userData = {
      username: 'organizer',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Test Organizer',
      email: 'organizer@example.com'
    };
    
    await createTestUser(userData);
    
    // Выполняем вход для получения токена
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });
    
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body;
    
    // Пытаемся получить профиль организатора (защищенный маршрут)
    const profileResponse = await request(app)
      .get('/api/organizer/profile')
      .set('Authorization', `Bearer ${token}`);
    
    // Проверяем успешность доступа
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('id');
    expect(profileResponse.body).toHaveProperty('role', 'ORGANIZER');
  });
  
  // Тест 7: Доступ к защищенному маршруту с недействительным токеном
  test('Доступ к защищенному маршруту с недействительным токеном', async () => {
    const invalidToken = 'invalid.token.here';
    
    // Пытаемся получить профиль организатора с недействительным токеном
    const profileResponse = await request(app)
      .get('/api/organizer/profile')
      .set('Authorization', `Bearer ${invalidToken}`);
    
    // Проверяем запрет доступа
    expect(profileResponse.status).toBe(401);
  });
  // Тест 3: Регистрация судьи по инвайт-ссылке
  test('Регистрация судьи по инвайт-ссылке', async () => {
    // Очищаем таблицу токенов перед тестом
    await InviteTokenModel.destroy({ where: {} });
    
    // Создаем тестового организатора
    const organizer = await createTestUser({
      username: 'inviter',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Inviter Organizer',
      email: 'inviter@example.com'
    });
    
    // Создаем инвайт-токен напрямую в БД
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-' + Date.now(),
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    
    console.log(`Токен создан: ${inviteToken.token}`);
    
    // Данные для регистрации судьи
    const judgeData = {
      username: 'testjudge',
      password: 'judge123',
      nickname: 'Test Judge',
      email: 'judge@example.com',
      token: inviteToken.token
    };
    
    // Регистрируем судью с использованием мок-контроллера
    const response = await request(app)
      .post('/api/invites/register-judge')
      .send(judgeData);
    
    // Debug вывод
    console.log('Ответ сервера:', {
      status: response.status,
      body: response.body
    });
    
    // Проверяем успешность регистрации
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.role).toBe('JUDGE');
    
    // Проверяем, что токен помечен как использованный
    const updatedToken = await InviteTokenModel.findOne({
      where: { token: inviteToken.token }
    });
    
    expect(updatedToken.used).toBe(true);
    expect(updatedToken.userId).not.toBeNull();
    
    // Проверяем, что судья добавлен в БД
    const judge = await UserModel.findOne({
      where: { username: judgeData.username }
    });
    
    expect(judge).not.toBeNull();
    expect(judge.role).toBe('JUDGE');
  });
  test('Доступ к маршруту организатора с токеном судьи', async () => {
    // Очищаем таблицу токенов перед тестом
    await InviteTokenModel.destroy({ where: {} });
    
    // Создаем тестового организатора
    const organizer = await createTestUser({
      username: 'rolesorganizer',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Roles Organizer',
      email: 'roles@example.com'
    });
    
    // Создаем инвайт-токен
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-' + Date.now(),
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    
    // Регистрируем судью
    const judgeData = {
      username: 'rolesjudge',
      password: 'judge123',
      nickname: 'Roles Judge',
      email: 'rolesjudge@example.com',
      token: inviteToken.token
    };
    
    await request(app)
      .post('/api/invites/register-judge')
      .send(judgeData);
    
    // Входим как судья
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: judgeData.username,
        password: judgeData.password
      });
    
    expect(loginResponse.status).toBe(200);
    const judgeToken = loginResponse.body.token;
    
    // Пытаемся получить доступ к маршруту организатора с токеном судьи
    const organizerRouteResponse = await request(app)
      .get('/api/organizer/judge-tokens') // Маршрут только для организаторов
      .set('Authorization', `Bearer ${judgeToken}`);
    
    console.log('Ответ на запрос judge-tokens от судьи:', {
      status: organizerRouteResponse.status,
      body: organizerRouteResponse.body
    });
    
    // Проверяем, что доступ запрещен
    expect(organizerRouteResponse.status).toBe(403); 
  });
  // Тест 12: Проверка хеширования пароля
test('Проверка хеширования пароля', async () => {
    // Создаем тестового пользователя
    const userData = {
      username: 'hashtest',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Hash Test',
      email: 'hashtest@example.com'
    };
    
    await createTestUser(userData);
    
    // Получаем пользователя из БД
    const user = await UserModel.findOne({ where: { username: userData.username } });
    
    // пароль сохранен в хешированном виде
    expect(user.password).not.toBe(userData.password);
    expect(user.password.startsWith('$2')).toBe(true);
    
    // хеш валидируется с правильным паролем
    const isValid = await bcrypt.compare(userData.password, user.password);
    expect(isValid).toBe(true);
    
    // роверяем, что хеш не валидируется с неверным паролем
    const isInvalid = await bcrypt.compare('неверныйпароль', user.password);
    expect(isInvalid).toBe(false);
  });
  // Тест 13: Проверка структуры JWT токена
test('Проверка структуры JWT токена', async () => {
    const jwt = require('jsonwebtoken');
    
    // Создаем тестового пользователя
    const userData = {
      username: 'jwttest',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'JWT Test',
      email: 'jwt@example.com'
    };
    
    await createTestUser(userData);
    
    //Выполняем вход
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });
    
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body;
    
    // Декодируем 
    const decoded = jwt.decode(token);
    console.log('Декодированный токен:', decoded);
    
    // Проверяем структуру токена
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('username', userData.username);
    expect(decoded).toHaveProperty('role', userData.role);
    expect(decoded).toHaveProperty('iat'); 
    expect(decoded).toHaveProperty('exp');
    
    // токен имеет срок действия
    const now = Math.floor(Date.now() / 1000);
    expect(decoded.exp).toBeGreaterThan(now);
    
    // Проверяем продолжительность жизни токена 
    const tokenLifespan = decoded.exp - decoded.iat;
    expect(tokenLifespan).toBeGreaterThanOrEqual(86400);
  });
  // Тест 4: Попытка регистрации с существующим именем пользователя
test('Попытка регистрации с существующим именем пользователя', async () => {
    // Очищаем таблицу токенов перед тестом
    await InviteTokenModel.destroy({ where: {} });
    
    // Создаем тестового организатора
    const organizer = await createTestUser({
      username: 'duplicateorg',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Duplicate Org',
      email: 'duplicate@example.com'
    });
    
    // Создаем первого пользователя
    // Сначала создаем инвайт-токен
    const inviteToken1 = await InviteTokenModel.create({
      token: 'test-token-' + Date.now(),
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    
    // Регистрируем первого судью
    const judgeData = {
      username: 'duplicatejudge',
      password: 'judge123',
      nickname: 'First Judge',
      email: 'judge1@example.com',
      token: inviteToken1.token
    };
    
    const firstResponse = await request(app)
      .post('/api/invites/register-judge')
      .send(judgeData);
    
    expect(firstResponse.status).toBe(200); 
    
    // Создаем второй инвайт-токен
    const inviteToken2 = await InviteTokenModel.create({
      token: 'test-token-second-' + Date.now(),
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    
    // 4. Пытаемся зарегистрировать второго судью с тем же именем
    const duplicateJudgeData = {
      username: 'duplicatejudge',
      password: 'different123',
      nickname: 'Second Judge',
      email: 'judge2@example.com',
      token: inviteToken2.token
    };
    
    const duplicateResponse = await request(app)
      .post('/api/invites/register-judge')
      .send(duplicateJudgeData);
    
    // Проверяем, что регистрация не удалась
    console.log('Ответ сервера при дублировании username:', {
      status: duplicateResponse.status,
      body: duplicateResponse.body
    });
    
    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body).toHaveProperty('message');
    // Проверяем часть сообщения об ошибке (может быть разная формулировка)
    expect(duplicateResponse.body.message.toLowerCase()).toMatch(/уже существует|already exists|duplicate/i);
    
    // Проверяем, что второй токен не использован
    const unusedToken = await InviteTokenModel.findOne({ 
      where: { token: inviteToken2.token } 
    });
    
    expect(unusedToken.used).toBe(false);
  });
  // Тест 9: Выход из системы
  test('Выход из системы (имитация на стороне клиента)', async () => {
    const userData = {
      username: 'logoutuser',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Logout User',
      email: 'logout@example.com'
    };
    
    await createTestUser(userData);
    

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });
    
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body;
    
    const profileResponseBeforeLogout = await request(app)
      .get('/api/organizer/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(profileResponseBeforeLogout.status).toBe(200);
    
    console.log('выход из системы путем удаления токена на клиенте');
    

    expect(true).toBe(true);
  });
  // Тест 14: Проверка middleware authMiddleware
test('Проверка middleware authMiddleware', async () => {
    // Создаем тестового пользователя
    const userData = {
      username: 'middlewareuser',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Middleware Test User',
      email: 'middleware@example.com'
    };
    
    await createTestUser(userData);
    
    // Выполняем вход для получения токена
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });
    
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body;
    
    // Запрашиваем защищенный маршрут, который возвращает данные из req.user
    const middlewareResponse = await request(app)
      .get('/api/organizer/profile')
      .set('Authorization', `Bearer ${token}`);
    
    // Проверяем что middleware декодировал токен и добавил данные пользователя в запрос
    expect(middlewareResponse.status).toBe(200);
    
    // Проверяем что данные пользователя есть в ответе
    expect(middlewareResponse.body).toHaveProperty('id');
    expect(middlewareResponse.body).toHaveProperty('name', userData.nickname); // Проверяем name вместо username
    expect(middlewareResponse.body).toHaveProperty('role', userData.role);
    
    console.log('Проверка authMiddleware: токен успешно декодирован и данные пользователя добавлены в req.user');
  });
});
