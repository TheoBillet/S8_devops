import { Router } from "express";
import { CheckLoginExist } from "../helpers/TrainerHelper.js";
import { CheckTradeExist, GetTradeWithLogin } from "../helpers/TradeHelper.js";

export const TradeUserRouter = Router();

TradeUserRouter.get('/:userId/trade', async (req, res) => {
    // Need to check trade:read
    const login = req.params.userId;
    try {
        await CheckLoginExist(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    let trades;
    try {
        trades = await GetTradeWithLogin(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    return res.status(200).send(trades);
});

TradeUserRouter.get('/:userId/trade/:tradeId', async (req, res) => {
    // Need to check trade:read
    const login = req.params.userId;
    try {
        await CheckLoginExist(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    const tradeId = req.params.tradeId;
    let trade;
    try {
        trade = await CheckTradeExist(tradeId);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    return res.status(200).send(trade);
});