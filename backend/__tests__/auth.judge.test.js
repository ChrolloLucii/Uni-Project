import request from 'supertest';
import app from '../testApp.js';
import sequelize from '../infrastructure/orm/sequelize.js';
import UserModel from '../infrastructure/models/userModel.js';
import InviteTokenModel from '../infrastructure/models/inviteTokenModel.js';
import bcrypt from 'bcrypt';

// Вспомогательная функция для создания тестового пользователя
async function createTestUser(userData) {
  // Хешируем пароль, чтобы он соответствовал реальному процессу
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return UserModel.create({
    ...userData,
    password: hashedPassword
  });
}

// Вспомогательная функция для получения токена авторизации
async function getAuthToken(username, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });
  
  return response.body.token;
}

// Настройка тестового окружения
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Очищаем таблицы между тестами
  await UserModel.destroy({ where: {} });
  await InviteTokenModel.destroy({ where: {} });
});

describe('Система приглашения судей', () => {
  // Тест 1: Создание приглашения для судьи организатором
  test('Создание приглашения для судьи организатором', async () => {
    const organizer = await createTestUser({
      username: 'createinvite',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Create Invite Organizer',
      email: 'create@example.com'
    });
    const token = await getAuthToken('createinvite', 'password123');
    const response = await request(app)
      .post('/api/organizer/generate-judge-token')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    const savedToken = await InviteTokenModel.findOne({ 
      where: { token: response.body.token } 
    });
    
    expect(savedToken).not.toBeNull();
    expect(savedToken.organizerId).toBe(organizer.id);
    expect(savedToken.role).toBe('JUDGE');
    expect(savedToken.used).toBe(false);
  });
  // Тест 2: Получение списка приглашений организатором
  test('Получение списка приглашений организатором', async () => {
    const organizer = await createTestUser({
      username: 'listinvites',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'List Invites Organizer',
      email: 'list@example.com'
    });
    const token = await getAuthToken('listinvites', 'password123');
    
    //Создаем несколько приглашений
    await InviteTokenModel.bulkCreate([
      {
        token: 'test-token-list-1',
        organizerId: organizer.id,
        role: 'JUDGE',
        used: false
      },
      {
        token: 'test-token-list-2',
        organizerId: organizer.id,
        role: 'JUDGE',
        used: false
      },
      {
        token: 'test-token-list-3',
        organizerId: organizer.id,
        role: 'JUDGE',
        used: true
      }
    ]);
    const response = await request(app)
      .get('/api/organizer/judge-tokens')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    const tokensForThisOrganizer = response.body.every(
      token => token.organizerId === organizer.id
    );
    expect(tokensForThisOrganizer).toBe(true);
  });
  
  // Тест 3: Удаление приглашения организатором
  test('Удаление приглашения организатором', async () => {
    const organizer = await createTestUser({
      username: 'deleteinvite',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Delete Invite Organizer',
      email: 'delete@example.com'
    });
    const token = await getAuthToken('deleteinvite', 'password123');
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-delete',
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    //Удаляем приглашение
    const response = await request(app)
      .delete(`/api/organizer/judge-tokens/${inviteToken.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
    
    //Проверяем отсутствие в БД
    const deletedToken = await InviteTokenModel.findOne({ 
      where: { id: inviteToken.id } 
    });
    expect(deletedToken).toBeNull();
  });
  
  // Тест 4: Проверка валидности токена приглашения
  test('Проверка валидности токена приглашения', async () => {
    const organizer = await createTestUser({
      username: 'validatetoken',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Validate Token Organizer',
      email: 'validate@example.com'
    });
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-validate',
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    const response = await request(app)
      .get(`/api/invites/verify-token?token=${inviteToken.token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', true);
    expect(response.body).toHaveProperty('role', 'JUDGE');
  });
  // Тест 5: Проверка использованного токена
  test('Проверка использованного токена', async () => {
    const organizer = await createTestUser({
      username: 'usedtoken',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Used Token Organizer',
      email: 'used@example.com'
    });
    
    //Создаем использованный токен
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-used',
      organizerId: organizer.id,
      role: 'JUDGE',
      used: true,
      userId: organizer.id 
    });

    const response = await request(app)
      .get(`/api/invites/verify-token?token=${inviteToken.token}`);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('valid', false);
    expect(response.body.message).toMatch(/already used/i);
  });
  
  // Тест 6: Регистрация судьи по валидному токену
  test('Регистрация судьи по валидному токену', async () => {
    const organizer = await createTestUser({
      username: 'reginviter',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Reg Inviter',
      email: 'reginviter@example.com'
    });

    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-register',
      organizerId: organizer.id,
      role: 'JUDGE',
      used: false
    });
    const judgeData = {
      username: 'newjudge',
      password: 'judge123',
      nickname: 'New Judge',
      email: 'newjudge@example.com',
      token: inviteToken.token
    };
    
    const response = await request(app)
      .post('/api/invites/register-judge')
      .send(judgeData);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('role', 'JUDGE');
    const updatedToken = await InviteTokenModel.findOne({
      where: { token: inviteToken.token }
    });
    expect(updatedToken.used).toBe(true);
    expect(updatedToken.userId).not.toBeNull();
    const judge = await UserModel.findOne({
      where: { username: judgeData.username }
    });
    expect(judge).not.toBeNull();
    expect(judge.role).toBe('JUDGE');
  });
  
  // Тест 7: Попытка повторного использования токена
  test('Попытка повторного использования токена', async () => {
    const organizer = await createTestUser({
      username: 'reuseinviter',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Reuse Inviter',
      email: 'reuse@example.com'
    });
    const inviteToken = await InviteTokenModel.create({
      token: 'test-token-reuse',
      organizerId: organizer.id,
      role: 'JUDGE',
      used: true,
      userId: organizer.id 
    });
    const judgeData = {
      username: 'reusejudge',
      password: 'judge123',
      nickname: 'Reuse Judge',
      email: 'reusejudge@example.com',
      token: inviteToken.token
    };
    
    const response = await request(app)
      .post('/api/invites/register-judge')
      .send(judgeData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/already used/i);
    const judge = await UserModel.findOne({
      where: { username: judgeData.username }
    });
    expect(judge).toBeNull();
  });
  
  // Тест 8: Попытка доступа к токенам другого организатора
  test('Попытка доступа к токенам другого организатора', async () => {
    //Создаем двух организаторов
    const organizer1 = await createTestUser({
      username: 'org1',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'First Organizer',
      email: 'org1@example.com'
    });
    
    const organizer2 = await createTestUser({
      username: 'org2',
      password: 'password123',
      role: 'ORGANIZER',
      nickname: 'Second Organizer',
      email: 'org2@example.com'
    });
    await InviteTokenModel.create({
      token: 'test-token-org1',
      organizerId: organizer1.id,
      role: 'JUDGE',
      used: false
    });
    const token = await getAuthToken('org2', 'password123');
    
    //Запрашиваем список токенов и проверяем, что токены первого организатора не видны
    const response = await request(app)
      .get('/api/organizer/judge-tokens')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    //Проверяем, что токены принадлежат только второму организатору
    const hasOtherOrganizerTokens = response.body.some(
      token => token.organizerId === organizer1.id
    );
    expect(hasOtherOrganizerTokens).toBe(false);
  });
});