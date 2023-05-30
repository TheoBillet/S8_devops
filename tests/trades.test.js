import app from '../app.js';
import request from "supertest";
import db from "../src/Database.js";
import { CreateTrainer } from '../src/managers/TrainerManager.js';
import { CreatePokemon } from '../src/managers/PokemonManager.js';

describe("Tests trades", () => {

    let thisDb = db;

	beforeAll(async () => {
		await thisDb.sync({ force: true });
        await createTrainers();
        await createPokemons();
	})

    afterAll(async () => {
        await thisDb.close();
    });

    const createTrainers = async () => {
        const admin = await CreateTrainer('Leo', 'Pokemaniac', 'leopkmn', 'cynthia', '1999-10-09');
        await CreateTrainer('Theo', 'Billet', 'theo', 'cynthia', '1999-10-09');
        return admin;
    }

    const createPokemons = async () => {
        const poke = await CreatePokemon('pikachu', 'pikachu', 13, 'M', false, 'leopkmn', 10.5, 5);
        await CreatePokemon('salameche', 'salameche', 10, 'M', false, 'theo', 10.5, 5);
        return poke;
    }

    const createTrade = async () => {
        const payload = {
            login_applicant: 'theo',
            login_receiver: 'leopkmn',
            pokemon_applicant: [2],
            pokemon_receiver: [1]
        };
        const response = await request(app).post('/trade').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
        return response;
    }

    test("it should pass", async () => {
        expect(true).toBe(true);
    });

    describe('POST', () => {
        it("Should return status code 200 for starting trade", async () => {
            const response = await createTrade();
            expect(response.statusCode).toBe(200);
        });
        it("Should return status code 400 with wrong pokemons", async () => {
            const payload = {
                login_applicant: 'theo',
                login_receiver: 'leopkmn',
                pokemon_applicant: [1],
                pokemon_receiver: [244]
            };
            const response = await request(app).post('/trade').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET', () => {
        it("Should return status code 200 for all trades for a trainer", async () => {
            const trade = await createTrade();
            const response = await request(app).get('/users/theo/trade').set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
        it("Should return status code 200 for specific trade for a trainer", async () => {
            const trade = await createTrade();
            const response = await request(app).get('/users/theo/trade/1').set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
        });
    });
});