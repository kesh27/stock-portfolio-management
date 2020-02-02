import express from "express";
import TradeService from "../service/trade";
import UserService from "../service/users";
import mongoose from 'mongoose';

const router = express.Router();

router.post('/trade', async(req,res,next) => {
    try {
        const portfolioId = req.body.portfolioId
        const tickerSymbol = req.body.tickerSymbol
        const tradeType = req.body.tradeType
        const quantity = req.body.quantity
        const price = req.body.price
        if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid portfolio id'})
        }
        const validatePortfolio = await UserService.findUserById(portfolioId);
        if (!validatePortfolio) {
            res.status(400)
            res.send({status: 200, ok: false, message: 'Invalid portfolio id'})
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

router.patch('/trade/:tradeId', async(req,res,next) => {
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
        const payload = req.body;
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

router.delete('/trade/:tradeId', async(req,res,next) => {
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