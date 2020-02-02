import Holdings from "../models/holdings";
// import EventManager from './EventManager';

class HoldingService { 
    async getHoldingByPortfolioAndTicker (portfolioId, ticker) {
        return Holdings.findOne(
            { portfolioId: portfolioId, tickerSymbol: ticker }
        );
    }

    async updateHolding (
        holdingId,
        payload
    ) {
        var holding = await Holdings.findOneAndUpdate(
            { _id: holdingId },
            { $set: payload },
            { new: true }
        )
        return holding
    }

    async createHolding (
        portfolioId,
        tickerSymbol,
        averageBuyPrice,
        sharesQuantity
    ) {
        var holding = new Holdings({
            portfolioId,
            tickerSymbol,
            averageBuyPrice,
            sharesQuantity
        });
        const holdingData = await holding.save();
        return holdingData;
    }

    async tradeAdded (data) {
        const ref = this;
        const existingHolding = await ref.getHoldingByPortfolioAndTicker(data.portfolioId, data.tickerSymbol);
        if(existingHolding && existingHolding.averageBuyPrice && (existingHolding.sharesQuantity || existingHolding.sharesQuantity === 0)) {
            var oldPrice = existingHolding.averageBuyPrice;
            var oldQuantity = existingHolding.sharesQuantity;
            var currentPrice = data.price;
            var currentQuantity = data.quantity;
            if(data.tradeType === "Buy") {
                var newQuantity = oldQuantity + currentQuantity;
                var newAveragePrice = ((oldPrice * oldQuantity) + (currentPrice * currentQuantity))/newQuantity;
                const newHolding = ref.updateHolding(existingHolding._id, { averageBuyPrice: newAveragePrice, sharesQuantity: newQuantity })
            } else if(data.tradeType === "Sell") {
                var newQuantity = Math.max((oldQuantity - currentQuantity), 0);
                const newHolding = ref.updateHolding(existingHolding._id, { sharesQuantity: newQuantity })
            }
        }
        else {
            var portfolioId = data.portfolioId;
            var tickerSymbol = data.tickerSymbol;
            var averageBuyPrice = data.price;
            var sharesQuantity = data.quantity;
            const holding = ref.createHolding(
                portfolioId,
                tickerSymbol,
                averageBuyPrice,
                sharesQuantity
            )
        } 
    }
}

const holdingService = new HoldingService();
export default holdingService;