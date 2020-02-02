import mongoose from 'mongoose';
import uuidv4 from 'uuid';

const Schema = mongoose.Schema;
const TRADETYPES = ["Buy","Sell"];

var TradeSchema = new Schema({
    // _id: {type: String, default: uuidv4.v4()},
    portfolioId: {type: Schema.Types.ObjectId, ref: 'User'},
    tickerSymbol: {type: String, required: [true, 'Ticker symbol required']},
    tradeType: {type: String, enum: TRADETYPES},
    quantity: {type: Number, required: [true, 'Quantity is required'], min: 1, validate : {
        validator : Number.isInteger,
        message   : '{VALUE} should be an integer value'
    }},
    price: {type: Number, required: [true, 'Price is required'], min: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Trade = mongoose.model('Trade', TradeSchema);
export default Trade
