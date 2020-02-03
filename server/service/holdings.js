import Holdings from "../models/holdings";
// import EventManager from './EventManager';

class HoldingService { 
    getHoldingByPortfolioAndTicker (portfolioId, ticker) {
        return Holdings.findOne(
            { portfolioId: portfolioId, tickerSymbol: ticker }
        );
    }

    getHoldingsByPortfolio (portfolioId) {
        return Holdings.find({ portfolioId: portfolioId });
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
        if(existingHolding 
            && (existingHolding.averageBuyPrice || existingHolding.averageBuyPrice === 0) 
            && (existingHolding.sharesQuantity || existingHolding.sharesQuantity === 0)) 
        {
            var oldPrice = existingHolding.averageBuyPrice;
            var oldQuantity = existingHolding.sharesQuantity;
            var currentPrice = data.price;
            var currentQuantity = data.quantity;
            if(data.tradeType === "Buy") {
                var newQuantity = Math.abs(oldQuantity + currentQuantity);
                var newAveragePrice = Math.abs(((oldPrice * oldQuantity) + (currentPrice * currentQuantity))/newQuantity);
                const newHolding = ref.updateHolding(existingHolding._id, { averageBuyPrice: newAveragePrice, sharesQuantity: newQuantity })
            } else if(data.tradeType === "Sell") {
                var newQuantity = Math.abs(oldQuantity - currentQuantity);
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

    async tradeUpdated (oldData, newData) {
        const ref = this;
        var portfolioId = newData.portfolioId;
        var tickerSymbol = newData.tickerSymbol;
        const existingHolding = await ref.getHoldingByPortfolioAndTicker(portfolioId, tickerSymbol);
        var oldQuantity = oldData.quantity
        var newQuantity = newData.quantity
        var currentQuantity = existingHolding.sharesQuantity
        if (newData.tradeType === "Sell") {
            const updatedQuantity = Math.abs(currentQuantity + oldQuantity - newQuantity)
            const newHolding = ref.updateHolding(existingHolding._id, { sharesQuantity: updatedQuantity })
        }
        else if (newData.tradeType === "Buy") {
            var updatedQuantity = Math.abs(currentQuantity - oldQuantity + newQuantity)
            var currentAverage = existingHolding.averageBuyPrice;
            var oldPrice = oldData.price
            var newPrice = newData.price
            var updatedAveragePrice = 0
            if (updatedQuantity !== 0 ) {
                updatedAveragePrice = Math.abs(((currentAverage * currentQuantity) - (oldQuantity * oldPrice) + (newQuantity * newPrice))/updatedQuantity)
            }
            const newHolding = ref.updateHolding(existingHolding._id, { averageBuyPrice: updatedAveragePrice, sharesQuantity: updatedQuantity })
        }
    }

    async tradeDeleted (data) {
        const ref = this;
        var portfolioId = data.portfolioId;
        var tickerSymbol = data.tickerSymbol;
        const existingHolding = await ref.getHoldingByPortfolioAndTicker(portfolioId, tickerSymbol); 
        var currentQuantity = existingHolding.sharesQuantity;
        var oldQuantity = data.quantity;
        if (data.tradeType === "Sell") {
            const updatedQuantity =  Math.abs(oldQuantity + currentQuantity)
            const newHolding = ref.updateHolding(existingHolding._id, { sharesQuantity: updatedQuantity })
        }
        else if (data.tradeType === "Buy") {
            var updatedQuantity =  Math.abs(oldQuantity - currentQuantity)
            var currentAverage = existingHolding.averageBuyPrice;
            var updatedAveragePrice = 0;
            if (updatedQuantity !== 0) {
                updatedAveragePrice = Math.abs(((currentAverage * currentQuantity) - (data.price * data.quantity))/updatedQuantity)
            }  
            const newHolding = ref.updateHolding(existingHolding._id, { averageBuyPrice: updatedAveragePrice, sharesQuantity: updatedQuantity })
        }
    }
}

const holdingService = new HoldingService();
export default holdingService;