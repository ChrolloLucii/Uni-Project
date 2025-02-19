class FakeUserRepository{
    constructor () {
        this.users = new Map();
    }
    async create(user){
        this.users.set(user.id, user);
        return user;
    }
    async findById(id){
        return this.users.get(id);
    }

    findAll(){
        return Array.from(this.users.values());
    }

    async update(user){
        if (!this.users.has(user.id)){
            throw new Error('User not found');
        }
        else {
        this.users.set(user.id, user);
        return user;
    }
    }
    async delete() {
        return this.users.delete(user.id);
    }
}
export default FakeUserRepository;