import decodeToken, { hasOrganizerAccess } from './authUtil.js';
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiSlVER0UiLCJpYXQiOjE3NDA1NzQxMjYsImV4cCI6MTc0MDU4MTMyNn0.OQ4B3Ad9UvUPmOWp7At5O-a6KfoOQPuWDQ-ow9_gzU8';

console.log('Раскодированный токен:', decodeToken(validToken)); 
console.log('Есть ли доступ организатора:', hasOrganizerAccess(validToken));

// Тест с некорректным токеном:
const invalidToken = 'invalid.token.value';
console.log('Раскодированный некорректный токен:', decodeToken(invalidToken)); 
console.log('Доступ организатора для некорректного токена:', hasOrganizerAccess(invalidToken));