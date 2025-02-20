class UserRepositoryInterface{
    async save(user){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');

    }
    async getById(id){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
    async update(user){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

}
export default UserRepositoryInterface;