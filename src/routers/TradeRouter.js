import { Router } from "express";
import { CheckTradeExist, CheckTradeInformation, CheckUpdateTrade, CreateTradeGlobal, TRADE_PARAM } from "../helpers/TradeHelper.js";
import { GetTradeById, UpdateTrade } from "../managers/TradeManager.js";
import { ChangePokemonsTrainer, CheckPokemonExistWithIdAndLogin } from "../helpers/PokemonHelper.js";

export const TradeRouter = Router();

TradeRouter.post('/', async (req, res) => {
    // Need to check trade:create:self
    if (!req.body || !Object.keys(req.body).length)
        return res.status(404).send('There is no parameter in the body. Please send params: ' + TRADE_PARAM);

    try {
        req.body = await CheckTradeInformation(req.body);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    const { login_applicant, login_receiver, pokemon_applicant, pokemon_receiver } = req.body;
    let trade = await CreateTradeGlobal(login_applicant, login_receiver, pokemon_applicant, pokemon_receiver);

    return res.status(200).send(trade);
});

TradeRouter.patch('/:tradeId', async (req, res) => {
    // Need to check trade:update:self
    const tradeId = req.params.tradeId;
    let trade;
    try {
        trade = await CheckTradeExist(tradeId);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    let pokemon_applicant = trade.pokemon_applicant;
    let pokemon_receiver = trade.pokemon_receiver;
    let login_applicant = trade.login_applicant;
    let login_receiver = trade.login_receiver;

    try {
        for (let i = 0; i < pokemon_applicant.length; i++) {
            let pokemonId = pokemon_applicant[i];
            await CheckPokemonExistWithIdAndLogin(pokemonId, login_applicant);
        }
        for (let i = 0; i < pokemon_receiver.length; i++) {
            let pokemonId = pokemon_receiver[i];
            await CheckPokemonExistWithIdAndLogin(pokemonId, login_receiver);
        }
        trade = await GetTradeById(tradeId);
        trade.set(await CheckUpdateTrade(trade, req.body));
    } catch (e) {
        return res.status(400).send(String(e));
    }
    trade = await UpdateTrade(trade);
    if (trade.state === 'A') {
        await ChangePokemonsTrainer(pokemon_applicant, login_receiver);
        await ChangePokemonsTrainer(pokemon_receiver, login_applicant);
    }
    return res.sendStatus(200);
});