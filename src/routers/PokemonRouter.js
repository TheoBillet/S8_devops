import { Router } from "express";
import { CreatePokemon, DeletePokemon, GetPokemonList, GetPokemonListWithoutShiny, UpdatePokemon } from "../managers/PokemonManager.js";
import { CheckPokemonExistWithIdAndLogin, CheckPokemonInformation, CheckPokemonInformationParameter, POKEMON_PARAM } from "../helpers/PokemonHelper.js";
import { CheckLoginExist } from "../helpers/TrainerHelper.js";

export const PokemonRouter = Router();

PokemonRouter.get('/:userId/pokemons', async (req, res) => {
    // Need to check pokemons:read
    const login = req.params.userId;
    try {
        await CheckLoginExist(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    var { page, pageSize } = req.query;
    if (!page || !(/^\d+$/.test(page)))
        page = 0;
    else
        page = Number(page);
    if (!pageSize || !(/^\d+$/.test(pageSize)))
        pageSize = 20;
    else
        pageSize = Number(pageSize);
    let pokemon;
    try {
        pokemon = CheckPokemonInformationParameter(req.query);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    const { species, name, levelMin, levelMax, gender, heightMin, heightMax, weightMin, weightMax, shiny } = pokemon;
    let result;
    if (typeof shiny !== 'undefined') {
        result = await GetPokemonList(page, pageSize, login, species, name, levelMin, levelMax, gender, shiny, heightMin, heightMax, weightMin, weightMax);
    } else {
        result = await GetPokemonListWithoutShiny(page, pageSize, login, species, name, levelMin, levelMax, gender, heightMin, heightMax, weightMin, weightMax);
    }
    return res.status(200).send(result);
});

PokemonRouter.post('/:userId/pokemons', async (req, res) => {
    // Need to check pokemons:create:self ou pokemon:create:all
    const login = req.params.userId;
    try {
        await CheckLoginExist(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    if (!req.body || !Object.keys(req.body).length)
        return res.status(404).send('There is no parameter in the body. Please send params: ' + POKEMON_PARAM);

    try {
        req.body = CheckPokemonInformation(req.body);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    const { species, name, level, gender, height, weight, shiny } = req.body;
    var pokemon = await CreatePokemon(species, name, level, gender, shiny, login, height, weight);
    return res.status(200).send(pokemon);
});

PokemonRouter.patch('/:userId/pokemons/:pokemonId', async (req, res) => {
    // Need to check pokemons:update:self
    const login = req.params.userId;
    const pokemonId = req.params.pokemonId;
    let pokemon;
    try {
        pokemon = await CheckPokemonExistWithIdAndLogin(pokemonId, login);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    try {
        pokemon.set(CheckPokemonInformationParameter(req.body));
    } catch (e) {
        return res.status(400).send(String(e));
    }
    await UpdatePokemon(pokemon);
    return res.sendStatus(200);
});

PokemonRouter.get('/:userId/pokemons/:pokemonId', async (req, res) => {
    // Need to check pokemons:read
    const login = req.params.userId;
    const pokemonId = req.params.pokemonId;
    let pokemon;
    try {
        pokemon = await CheckPokemonExistWithIdAndLogin(pokemonId, login);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    return res.status(200).send(pokemon);
});

PokemonRouter.delete('/:userId/pokemons/:pokemonId', async (req, res) => {
    // Need to check pokemons:delete:self
    const login = req.params.userId;
    const pokemonId = req.params.pokemonId;
    let pokemon;
    try {
        pokemon = await CheckPokemonExistWithIdAndLogin(pokemonId, login);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    await DeletePokemon(pokemonId);

    return res.sendStatus(200);
});