import Trade from "../models/trade";
import HoldingService from "./holdings";
// import EventManager from './EventManager';

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
        // EventManager.emitEvent('trade_create', tradeData, {
        //     portfolioId,
        //     tickerSymbol,
        //     tradeType,
        //     quantity,
        //     price
        // });
        HoldingService.tradeAdded(tradeData)
        return tradeData
    }

    async updateTrade (
        tradeId,
        payload
    ) {
        const oldTrade = await this.getTrade(tradeId)
        var updatedTrade = await Trade.findOneAndUpdate(
            { _id: tradeId },
            { $set: payload },
            { new: true }
        )
        HoldingService.tradeUpdated(oldTrade, updatedTrade)
        return updatedTrade
    }

    async deleteTrade (id) {
        const deletedTrade = await Trade.findByIdAndDelete(id)
        HoldingService.tradeDeleted(deletedTrade)
        return deletedTrade
    }

    getTrade(id) {
        return Trade.findOne({_id: id});
    }

}

const tradeService = new TradeService();
export default tradeService;