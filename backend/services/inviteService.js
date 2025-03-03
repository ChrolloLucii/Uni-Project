import jwt from 'jsonwebtoken';
import repository from '../domain/fakeRepositories/singletonRepo.js';
const secret = '12341234'
const expiry = '2h';


const InviteService = {
    generateInviteToken(payload){
        const {role} = payload;
        const finalRole = role || 'JUDGE';
        const tokenPayload = { role : finalRole};
        return jwt.sign(tokenPayload, secret, {expiresIn : expiry});
    },


    verifyInviteToken(token){
        try {
            return jwt.verify(token, secret);
        } catch (error){
            throw new Error('Invalid or expired token');
        }
    },
    async registerUserFromInvite({token, username, password, nickname, email}){
        const inviteData = this.verifyInviteToken(token);
        const user = {
            id : Date.now(),
            role : inviteData.role,
            nickname,
            username,
            password,
            email
        };
    return await repository.create(user);
    }
}
export default InviteService;