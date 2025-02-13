export async function findUser(id) {
    return {id, name: "John Doe"};
}

// @backend/services
// Содержит бизнес-логику, которая не зависит от HTTP-слоя. Здесь можно вынести обработку сложных процессов, операций с данными и т.п.