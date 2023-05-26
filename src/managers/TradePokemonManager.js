import TradePokemon from "../models/TradePokemon.js";

export async function CreateTradePokemon(id_trade, id_pokemon, login_trainer) {
    return await TradePokemon.create({
        id_trade: id_trade,
        id_pokemon: id_pokemon,
        login_trainer: login_trainer
    });
}

export async function GetTradePokemonByIdTrade(id_trade) {
    return await TradePokemon.findAll({
        where: {
            id_trade: id_trade,
        }
    });
}