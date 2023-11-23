export default class UserRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getUserById = (idUser) =>
    {
        return this.dao.getUserById(idUser);
    }
    
    getUserByEmail = (emailUser) =>
    {
        return this.dao.getByMongose(emailUser);
    }

    getUserByResetToken = (token) => 
    {
        return this.dao.getUserByResetToken(token);
    }
    
    changeUserRole = (userId) =>
    {
        return this.dao.changeUserRole(userId);
    }
}