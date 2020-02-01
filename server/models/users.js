import mongoose from 'mongoose';
import uuidv4 from 'uuid';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: {type: String, default: uuidv4.v4()},
    email: { type: String, default: '', unique: true },
    portfolioId: {type: String, default: uuidv4.v4(), unique: true},
})

const User = mongoose.model('User', UserSchema);
export default User
