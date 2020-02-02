import mongoose from 'mongoose';
import uuidv4 from 'uuid';

const Schema = mongoose.Schema;

var HoldingsSchema = new Schema({
        // _id: {type: String, default: uuidv4.v4()},
        portfolioId: {type: Schema.Types.ObjectId, ref: 'User'},
        tickerSymbol: {type: String, required: [true, 'Ticker symbol required']},
        averageBuyPrice: {type: Number, required: [true, 'Price is required'], min: 0},
        sharesQuantity: {type: Number, required: [true, 'Quantity is required'], min: 0, validate : {
            validator : Number.isInteger,
            message   : '{VALUE} should be an integer value'
        }},
    },
    {
        timestamps: true,
    }
)

const Holdings = mongoose.model('Holdings', HoldingsSchema);
export default Holdings
