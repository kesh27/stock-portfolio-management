import express from "express";
import HoldingService from "../service/holdings";
import TradeService from "../service/trade";
import UserService from "../service/users";
import mongoose from 'mongoose';

const router = express.Router();

async function isSellable (portfolioId, tickerSymbol, quantity) {
    const holdings = await HoldingService.getHoldingByPortfolioAndTicker(portfolioId, tickerSymbol);
    if (!holdings) {
        return false
    }
    else if(holdings.sharesQuantity < quantity) {
        return false
    }
    return true
};

router.post('/trade/', async(req,res,next) => {
    try {
        const portfolioId = req.body.portfolioId
        const tickerSymbol = req.body.tickerSymbol
        const tradeType = req.body.tradeType
        const quantity = req.body.quantity
        const price = req.body.price
        if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid portfolio id'})
            return
        }
        const validatePortfolio = await UserService.findUserById(portfolioId);
        if (!validatePortfolio) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid portfolio id'})
            return
        }
        // User should have sufficient number of shares before placing sell order
        if (tradeType === "Sell" && !await isSellable(portfolioId, tickerSymbol, quantity)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Insufficient shares to place sell order'})
            return
        }
        const trade = await TradeService.addTrade(
            portfolioId,
            tickerSymbol,
            tradeType,
            quantity,
            price
        );
        res.send({data: trade, status: 200, ok: true})
    } catch (err) {
        res.status(400);
        res.send({status: 400, ok: false, message: err.message})
        next(err);
    }
})

router.patch('/trade/:tradeId/', async(req,res,next) => {
    try {
        const tradeId = req.params.tradeId;
        if (!mongoose.Types.ObjectId.isValid(tradeId)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid trade id'})
            return
        }
        const payload = req.body;
        // User can update only share quantity and price
        if (payload && payload.portfolioId || payload.tickerSymbol || payload.tradeType) {
            res.status(403)
            res.send({status: 403, ok: false, message: 'Cannot update the requested values'})
            return
        }
        const trade = await TradeService.getTrade(tradeId)
        if (!trade) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid trade id'})
            return
        }
        // if the user initially sells less quantity and then tries to raise the share quantity
        if(trade.tradeType === "Sell" && payload.quantity && payload.quantity > trade.quantity) {
            if (!await isSellable(trade.portfolioId, trade.tickerSymbol, payload.quantity - trade.quantity)) {
                res.status(400)
                res.send({status: 400, ok: false, message: 'Insufficient shares to update sell order'})
                return
            }
        }
        const updateTrade = await TradeService.updateTrade(
            tradeId,
            payload
        )
        res.send({data: updateTrade, status: 200, ok: true})
    } catch (err) {
        res.status(400);
        res.send({status: 400, ok: false, message: err.message})
        next(err)
    }
})

router.delete('/trade/:tradeId/', async(req,res,next) => {
    try {
        const tradeId = req.params.tradeId;
        if (!mongoose.Types.ObjectId.isValid(tradeId)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid trade id'})
        }
        const trade = await TradeService.getTrade(tradeId)
        if (!trade) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid trade id'})
        }
        const deleteTrade = await TradeService.deleteTrade(tradeId);
        res.send({status: 200, ok: true})
    } catch (err) {
        res.status(400);
        res.send({status: 400, ok: false, message: err.message})
        next(err)
    }
})

export default router;