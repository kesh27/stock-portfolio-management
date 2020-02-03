import express from "express";
import HoldingService from "../service/holdings";
import UserService from "../service/users";
import mongoose from 'mongoose';

const router = express.Router();

router.get('/returns/:portfolioId/', async(req,res,next) => {
    try {
        const portfolioId = req.params.portfolioId
        // check if it is a valid object id
        if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid portfolio id'})
            return
        }
        const validatePortfolio = await UserService.findUserById(portfolioId);
        // check if portfolio exists
        if (!validatePortfolio) {
            res.status(400)
            res.send({status: 400, ok: false, message: 'Invalid portfolio id'})
            return
        }
        const holdings = await HoldingService.getHoldingsByPortfolio(portfolioId)
        var sum = 0
        const currentValue = 100
        holdings.forEach(value => {
            sum = sum + ((currentValue - value.averageBuyPrice) * value.sharesQuantity)
        })
        res.send({data: {cumulative_return: sum}, status: 200, ok: true})

    } catch (err) {
        res.status(400);
        res.send({status: 400, ok: false, message: err.message})
        next(err)
    }
});

export default router;