import User from "../models/users";

class UserService { 
    async addUser(email) {
        var user = new User({
            email: email
        });
        await user.save()
        return User.findOne({email: email})
    }

    findUser(email) {
        return User.findOne({email: email});
    }
}

const userService = new UserService();
export default userService;