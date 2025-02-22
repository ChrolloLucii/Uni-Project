import decodeToken, { hasOrganizerAccess } from './authUtil.js';
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJvcmdhbml6ZXIiLCJyb2xlIjoiT1JHQU5JWkVSIiwiaWF0IjoxNzQwMjY1MTMxLCJleHAiOjE3NDAyNjg3MzF9.UKv_c1zl4N6o8ryaJpxiQ6LOGBPLPabRTExYGHqfmcc.eyJpZCI6MSwibmlja25hbWUiOiJvcmdhbml6ZXIiLCJyb2xlIjoiT1JHQU5JWkVSIiwiaWF0IjoxNzQwMjYzODQzLCJleHAiOjE3NDAyNjc0NDN9.g-lkUmpjq7vX2p95Fe4cxjf_0beODtq8YhKCVTNLMEU';

console.log('Раскодированный токен:', decodeToken(validToken)); 
console.log('Есть ли доступ организатора:', hasOrganizerAccess(validToken));

// Тест с некорректным токеном:
const invalidToken = 'invalid.token.value';
console.log('Раскодированный некорректный токен:', decodeToken(invalidToken)); 
console.log('Доступ организатора для некорректного токена:', hasOrganizerAccess(invalidToken));