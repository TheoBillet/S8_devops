import { Op } from "sequelize";
import Trade from "../models/Trade.js";

export async function CreateTrade(login_applicant, login_receiver, state = 'P') {
    return await Trade.create({
        login_applicant: login_applicant,
        login_receiver: login_receiver,
        state: state
    });
}

export async function GetTradeByLogin(login) {
    return await Trade.findAll({
        where: {
            [Op.or]: [
                {login_applicant: login},
                {login_receiver: login}
            ]
        }
    });
}

export async function GetTradeById(id) {
    return await Trade.findOne({
        where: {
            id: id
        }
    });
}

export async function UpdateTrade(trade) {
    return await trade.save();
}