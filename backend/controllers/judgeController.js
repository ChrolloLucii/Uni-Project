import UserModel from "../infrastructure/models/userModel.js";


const JudgeController = {
    async getJudges(req, res){
    try {
        const judges = await UserModel.findAll({ where: { role: 'JUDGE' }, attributes: ['id', 'username', 'nickname', 'email'] });

        return res.status(200).json(judges);
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
}
export default JudgeController;
