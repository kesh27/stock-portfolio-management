import mongoose from 'mongoose';
import uuidv4 from 'uuid';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
        // _id: {type: String, default: uuidv4.v4()},
        // portfolioId: {type: String, default: uuidv4.v4(), unique: true},
        email: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', UserSchema);
export default User
