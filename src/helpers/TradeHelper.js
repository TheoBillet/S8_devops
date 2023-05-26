import { GetPokemonById } from "../managers/PokemonManager.js";
import { CreateTrade, GetTradeById, GetTradeByLogin } from "../managers/TradeManager.js";
import { CreateTradePokemon, GetTradePokemonByIdTrade } from "../managers/TradePokemonManager.js";
import { CheckLoginExist } from "./TrainerHelper.js";

export const TRADE_PARAM = "login_applicant (string), login_receiver (string), pokemon_applicant (Array[int] size max 6), pokemon_receiver (Array[int] size max 6)"

export async function CheckLogins(login_applicant, login_receiver) {
    if (!login_applicant)
        throw new Error("login_applicant parameter doesn't exist");
    if (!login_receiver)
        throw new Error("login_receiver parameter doesn't exist");
    const trainer1 = await CheckLoginExist(login_applicant);
    const trainer2 = await CheckLoginExist(login_receiver);
    if (trainer1.login == trainer2.login) {
        throw new Error("You can't change pokemons with yourself !");
    }
}

export async function CheckPokemonApplicant(pokemons, login) {
    if (!pokemons)
        throw new Error("pokemon_applicant parameter doesn't exist");
    if (!Array.isArray(pokemons))
        throw new Error('pokemon_applicant parameter must be an array');
    if (pokemons.length > 6) {
        throw new Error('pokemon_applicant parameter must have a maximum size of 6');
    }
    for (const elt of pokemons) {
        if (isNaN(elt)) {
            throw new Error(`${elt} is not a number`);
        }
        const pokemon = await GetPokemonById(elt);
        if (!pokemon)
            throw new Error("pokemonId in pokemon_applicant not found with this pokemonId : " + elt);
        if (pokemon.login_trainer !== login)
            throw new Error("pokemonId " + pokemon.id+ " does not have " + login + " as a trainer");
    };
}

export async function CheckPokemonReceive(pokemons, login) {
    if (!pokemons)
        throw new Error("pokemon_receiver parameter doesn't exist");
    if (!Array.isArray(pokemons))
        throw new Error('pokemon_receiver parameter must be an array');
    if (pokemons.length > 6) {
        throw new Error('pokemon_receiver parameter must have a maximum size of 6');
    }
    for (const elt of pokemons) {
        if (isNaN(elt)) {
            throw new Error(`${elt} is not a number`);
        }
        const pokemon = await GetPokemonById(elt);
        if (!pokemon)
            throw new Error("pokemonId in pokemon_receive not found with this pokemonId : " + elt);
        if (pokemon.login_trainer !== login)
            throw new Error("pokemonId " + pokemon.id+ " does not have " + login + " as a trainer");
    };
}

export async function CheckTradeInformation(params) {
    await CheckLogins(params.login_applicant, params.login_receiver);
    await CheckPokemonApplicant(params.pokemon_applicant, params.login_applicant);
    await CheckPokemonReceive(params.pokemon_receiver, params.login_receiver);
    
    return params;
}

export async function CreateTradeGlobal(login_applicant, login_receiver, pokemon_applicant, pokemon_receiver) {
    let trade = await CreateTrade(login_applicant, login_receiver);

    for (const elt of pokemon_applicant) {
        await CreateTradePokemon(trade.id, elt, login_applicant);
    };
    for (const elt of pokemon_receiver) {
        await CreateTradePokemon(trade.id, elt, login_receiver);
    };

    return trade;
}

export async function GetTradeWithLogin(login) {
    let res = [];
    const trades = await GetTradeByLogin(login);
    if (!trades) {
        return res;
    }
    for (const trade of trades) {
        let element = {};
        element.pokemon_applicant = [];
        element.pokemon_receiver = [];

        element.id_trade = trade.id;
        element.state = trade.state;
        element.login_applicant = trade.login_applicant;
        element.login_receiver = trade.login_receiver;

        const tradePokemons = await GetTradePokemonByIdTrade(trade.id);
        for (const tradePokemon of tradePokemons) {
            if (tradePokemon.login_trainer === trade.login_applicant) {
                element.pokemon_applicant.push(tradePokemon.id_pokemon);
            } else {
                element.pokemon_receiver.push(tradePokemon.id_pokemon);
            }
        }
        res.push(element);
    };
    return res;
}

export async function CheckTradeExist(id) {
    if (!id)
        throw new Error("tradeId parameter doesn't exist");
    id = Number(id);
    if (isNaN(id))
        throw new Error("tradeId isn't number");
    const trade = await GetTradeById(id);
    if (!trade)
        throw new Error("trade not found with this tradeId");
    let res = {};
    res.pokemon_applicant = [];
    res.pokemon_receiver = [];

    res.id_trade = trade.id;
    res.state = trade.state;
    res.login_applicant = trade.login_applicant;
    res.login_receiver = trade.login_receiver;

    const tradePokemons = await GetTradePokemonByIdTrade(trade.id);
    for (const tradePokemon of tradePokemons) {
        if (tradePokemon.login_trainer === trade.login_applicant) {
            res.pokemon_applicant.push(tradePokemon.id_pokemon);
        } else {
            res.pokemon_receiver.push(tradePokemon.id_pokemon);
        }
    }
    return res;
}

export async function CheckUpdateTrade(trade, params) {
    if (!params.login_receiver)
        throw new Error("login_receiver parameter doesn't exist");
    await CheckLoginExist(params.login_receiver);
    if (trade.login_receiver !== params.login_receiver)
        throw new Error("login_receiver parameter " + params.login_receiver + " doesn't match with the login_receiver in trade " + trade.login_receiver);
    if (!params.state)
        throw new Error("state parameter doesn't exist");
    const stateAccepted = ["A", "R"];
    if (!stateAccepted.includes(params.state))
        throw new Error("state parameter must be 'A' (accepted) or 'R' (refused)");
    if (stateAccepted.includes(trade.state))
        throw new Error("state of trade is already accepted or refused. You must do recreate a trade");
    return params;
}