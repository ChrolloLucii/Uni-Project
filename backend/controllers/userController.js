export async function getUser(req, res) {
    // пример: Логика для получения пользователя 
    res.json({id : req.params.id, name: "John Doe"});
}