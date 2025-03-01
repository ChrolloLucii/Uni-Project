class FakeUserRepository {
    constructor () {
      this.users = new Map();
      const superUser = {
          id : 1,
          nickname : 'organizer',
          role : 'ORGANIZER',
          username : 'user88',
          password : 'securepassword',
          email : null
      };
      this.users.set(superUser.id, superUser);
    }
    async create(user){
      this.users.set(user.id, user);
      return user;
    }
    async findById(id){
      return this.users.get(id);
    }
    async findAll(){
      return Array.from(this.users.values());
    }
    async update(user){
      if (!this.users.has(user.id)){
        throw new Error('User not found');
      } else {
        this.users.set(user.id, user);
        return user;
      }
    }
    async delete(id) {
      return this.users.delete(id);
    }
  }
  export default FakeUserRepository;