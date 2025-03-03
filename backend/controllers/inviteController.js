import InviteService from "../services/InviteService.js";

const inviteController = {
    register : async (req, res) =>{
        try {
            const {token, username, password, nickname, email} = req.body;
            const user = await InviteService.registerUserFromInvite({token, username, password, nickname, email});
            res.status(200).json({message: 'User registered successfully', user, redirectUrl: '/login'});
        
        }

        catch(error) {
            res.status(400).json({message: error.message});
        }

    }

};
export default inviteController;