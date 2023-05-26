import { GetPokemonById, UpdatePokemon } from "../managers/PokemonManager.js";
import { CheckLoginExist } from "./TrainerHelper.js";

export const POKEMON_PARAM = "species (string), level (int), gender (char M (Male) or F (Female) or U (Undefined)), shiny (boolean), login (string), name (string optional), height (double precision optional), weight (double precision optional)"

export function CheckSpecies(species) {
    if (!species)
        throw new Error("species parameter doesn't exist");
    if (typeof species != "string")
        throw new Error("species parameter isn't string");
    if (species.length > 255)
        throw new Error("species parameter is too long");
}

export function CheckName(params) {
    let { name, species }= params;
    if (!name)
        return species;
    if (typeof name != "string")
        throw new Error("name parameter isn't string");
    if (name.length > 255)
        throw new Error("name parameter is too long");
    return name;
}

export function CheckLevel(level) {
    if (!level)
        throw new Error("level parameter doesn't exist");
    if (typeof level != "number")
        throw new Error("level parameter isn't number");
    if (level % 1 != 0)
        throw new Error("level parameter isn't whole number");
    if (level < 1 || level > 100)
        throw new Error("level parameter is not between 1 and 100 included");
}

export function CheckGender(gender) {
    if (!gender)
        throw new Error("gender parameter doesn't exist");
    if (typeof gender != "string")
        throw new Error("gender parameter isn't string");
    if (gender.length != 1)
        throw new Error("gender parameter is too long, he must be 'M', 'F' or 'U'");
    if (!["M", "F", "U"].includes(gender)) {
        throw new Error("gender parameter must be 'M', 'F' or 'U'")
    }
}

export function CheckHeight(height) {
    if (!height)
        throw new Error("height parameter doesn't exist");
    if (typeof height != "number")
        throw new Error("height parameter isn't number");
    if (height <= 0) {
        throw new Error("height parameter isn't negative or equals to 0")
    }
    return Math.round(height * 100) / 100;
}

export function CheckWeight(weight) {
    if (!weight)
        throw new Error("weight parameter doesn't exist");
    if (typeof weight != "number")
        throw new Error("weight parameter isn't number");
    if (weight <= 0) {
        throw new Error("weight parameter isn't negative or equals to 0")
    }
    return Math.round(weight * 100) / 100;
}

export function CheckShiny(shiny) {
    if (!shiny)
        return;
    if (typeof shiny != "boolean")
        throw new Error("shiny parameter isn't boolean");
}

export async function CheckPokemonExistWithIdAndLogin(pokemonId, login) {
    try {
        await CheckLoginExist(login);
    } catch (e) {
        throw e;
    }
    if (!pokemonId)
        throw new Error("pokemonId parameter doesn't exist");
    if (isNaN(pokemonId))
        throw new Error("pokemonId isn't number");
    
    const pokemon = await GetPokemonById(pokemonId);
    if (!pokemon)
        throw new Error("pokemon not found with this pokemonId");
    if (pokemon.login_trainer !== login)
        throw new Error(pokemon.name + " does not have " + login + " as a trainer");
    return pokemon;
}

export function CheckPokemonInformation(params) {
    CheckSpecies(params.species);
    params.name = CheckName(params);
    CheckLevel(params.level);
    CheckGender(params.gender);
    params.height = CheckHeight(params.height);
    params.weight = CheckWeight(params.weight);
    CheckShiny(params.shiny);

    return params;
}

export function CheckPokemonInformationParameter(params) {
    if (params.species) {
        CheckSpecies(params.species);
    }
    if (params.name) {
       CheckName(params);
    }
    if (params.levelMin) {
        params.levelMin = Number(params.levelMin);
        CheckLevel(params.levelMin);
    }
    if (params.levelMax) {
        params.levelMax = Number(params.levelMax);
        CheckLevel(params.levelMax);
    }
    if (params.level) {
        if (params.levelMax || params.levelMin) {
            throw new Error("You cannot have filter on level AND levelMin or/and levelMax");
        }
        params.level = Number(params.level);
        CheckLevel(params.level);
        params.levelMin = params.level;
        params.levelMax = params.level;
    }
    if (params.gender) {
        CheckGender(params.gender);
    }
    if (params.heightMin) {
        params.heightMin = Number(params.heightMin);
        params.heightMin = CheckHeight(params.heightMin);
    }
    if (params.heightMax) {
        params.heightMax = Number(params.heightMax);
        params.heightMax = CheckHeight(params.heightMax);
    }
    if (params.height) {
        if (params.heightMax || params.heightMin) {
            throw new Error("You cannot have filter on height AND heightMin or/and heightMax");
        }
        params.height = Number(params.height);
        params.height = CheckHeight(params.height);
        params.heightMin = params.height;
        params.heightMax = params.height;
    }
    if (params.weightMin) {
        params.weightMin = Number(params.weightMin);
        params.weightMin = CheckWeight(params.weightMin);
    }
    if (params.weightMax) {
        params.weightMax = Number(params.weightMax);
        params.weightMax = CheckWeight(params.weightMax);
    }
    if (params.weight) {
        if (params.weightMax || params.weightMin) {
            throw new Error("You cannot have filter on weight AND weightMin or/and weightMax");
        }
        params.weight = Number(params.weight);
        params.weight = CheckWeight(params.weight);
        params.weightMin = params.weight;
        params.weightMax = params.weight;
    }
    if (params.shiny) {
        if (typeof params.shiny == "string" && (params.shiny.toLowerCase() === "false" || params.shiny.toLowerCase() === "true")) {
            params.shiny = JSON.parse(params.shiny.toLowerCase());
        }
        CheckShiny(params.shiny);
    }
    return params;
}

export async function ChangePokemonsTrainer(pokemonsId, newTrainer) {
    for (let i = 0; i < pokemonsId.length; i++) {
        let pokemonId = pokemonsId[i];
        let pokemon = await GetPokemonById(pokemonId);
        pokemon.login_trainer = newTrainer;
        await UpdatePokemon(pokemon);
    }
}