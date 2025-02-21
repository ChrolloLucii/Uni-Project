import login from '../services/authService.js';

const AuthController = {
    login: async (req, res) => {
    try{
        const {username, password} = req.body;
        const token = await login(username, password);
        res.status(200).json({token, message :'Login successful' });
    }
    catch(error){
        res.status(401).json({message: error.message});
        }
    },
    logout : async (req,res) => {
        res.status(200).json({message: 'Logout successful'});
    }
};

export default AuthController;