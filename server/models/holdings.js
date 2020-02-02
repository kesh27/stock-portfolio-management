import mongoose from 'mongoose';
import uuidv4 from 'uuid';

const Schema = mongoose.Schema;

var HoldingsSchema = new Schema({
    _id: {type: String, default: uuidv4.v4()},
    portfolioId: {type: Schema.Types.ObjectId, ref: 'User'},
    tickerSymbol: {type: String, required: [true, 'Ticker symbol required']},
    sharesQuantity: {type: Number, required: [true, 'Quantity is required']},
    averageBuyPrice: {type: Number, required: [true, 'Price is required']},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Holdings = mongoose.model('Holdings', HoldingsSchema);
export default Holdings
