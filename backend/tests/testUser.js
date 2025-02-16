import UserFactory from '../domain/factories/UserFactory.js';

// Создаем фабрику
const factory = new UserFactory();

// Создаем простого игрока
const player = factory.createUser({
    id: 1,
    nickname: "SimplePlayer123",
    role: "PLAYER",  // По умолчанию будет PLAYER, можно не указывать
    teamId: 1
});


console.log(player.nickname); // "SimplePlayer123"
player.updateRole("CAPTAIN");


console.log(player.isCaptainOf(1)); // true