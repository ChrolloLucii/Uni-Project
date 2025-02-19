class UserRepositoryInterface{
   async createUser(user){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
   }
   async getUserById(user){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
   }

   async update(user){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
   }
   async findAll(){ 
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
   }

    async delete(user){
          throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

}
export default UserRepositoryInterface;