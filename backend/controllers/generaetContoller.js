import InviteService from "../services/inviteService.js";

const generateContoller = {
    async generateToken(req, res) {
        try {
            const { email, role } = req.body;
            const token = InviteService.generateInviteToken({ email, role });
            res.status(200).json({ message: 'Token generated successfully', token });
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default generateContoller;