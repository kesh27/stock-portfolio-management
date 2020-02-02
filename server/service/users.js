import User from "../models/users";

class UserService { 
    async addUser(email) {
        var user = new User({
            email: email
        });
        const userData = await user.save()
        return userData
    }

    findUser(email) {
        return User.findOne({email: email});
    }

    findUserById(id) {
        return User.findOne({_id: id})
    }
}

const userService = new UserService();
export default userService;