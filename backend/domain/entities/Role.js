class Role {
    static ORGANIZER = 'ORGANIZER';
    static JUDGE = 'JUDGE';
    static CAPTAIN = 'CAPTAIN';
    static PLAYER = 'PLAYER';


    constructor(roleId, name , permissions){
        this.roleId = roleId,
        this.name = name,
        this.permissions = permissions
    }};

export default Role;