class User { 
    constructor( id, role, nickname, teamId) {
        this.id = id;
        this.role = role;
        this.nickname = nickname;
        this.teamId = teamId;
    }

    updateName(nickname){
        this.nickname = nickname;
    }

    
    updateRole(role){
        this.role = role;
    }
    getInfo() {
        return {
            id: this.id,
            role : this.role,
            nickname:  this.nickname,
            teamId: this.teamId
    }
}
    isCaptainOf(teamId) {
        return this.role === 'CAPTAIN' && this.teamId === teamId;
    }
}
export default User;