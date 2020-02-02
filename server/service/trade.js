import Trade from "../models/trade";

class TradeService { 
    async addTrade(
        portfolioId,
        tickerSymbol,
        tradeType,
        quantity,
        price
    ) {
        var trade = new Trade({
            portfolioId,
            tickerSymbol,
            tradeType,
            quantity,
            price
        });
        const tradeData = await trade.save()
        return tradeData
    }

    async updateTrade (
        tradeId,
        payload
    ) {
        var trade = await Trade.findOneAndUpdate(
            { _id: tradeId },
            { $set: payload },
            { new: true }
        )
        return trade
    }

    async deleteTrade (id) {
        return Trade.findByIdAndDelete(id)
    }

    getTrade(id) {
        return Trade.findOne({_id: id});
    }

}

const tradeService = new TradeService();
export default tradeService;