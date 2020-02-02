import express from "express";
import UserService from "../service/users";
import validator from 'validator';
import httpErrors from 'http-errors';

const router = express.Router();

router.get('/users/:userEmail', async (req,res,next) => {
    try {
        const email = req.params.userEmail
        if (!validator.isEmail(email)) {
            res.status(400)
            res.send({message: "Validation error", status: 400, ok: false})
            return
        }
        const userInstance = await UserService.findUser(email);
        if (userInstance) {
            res.send({data: userInstance, status: 200, ok: true})
        }
        else {
            res.status(404)
            res.send({message: "User doesn't exists", status: 404, ok: false})
            return
        }
    } catch (err) {
        next(err)
    }
});

router.post('/users', async (req,res,next) => {
    try {
        const email = req.body.email
        if (!validator.isEmail(email)) {
            res.status(400)
            res.send({message: "Validation error", status: 400, ok: false})
            return
        }
        const userInstance = await UserService.findUser(email);
        if (userInstance) {
            res.status(400)
            res.send({message: "User already exists", status: 400, ok: false})
            return
        }
        else {
            const user = await UserService.addUser(email);
            res.send({data: user, status: 200, ok: true})
        }
    } catch (err) {
        res.status(400);
        res.send({status: 400, ok: false, message: err.message})
        next(err)
    }
});

export default router;