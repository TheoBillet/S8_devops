import app from '../app.js';
import request from "supertest";
import db from "../src/Database";
import { CreateTrainer } from '../src/managers/TrainerManager.js';

describe("tests pokemons", () => {

    let thisDb = db;

	beforeAll(async () => {
		await thisDb.sync({ force: true });
	})

    afterAll(async () => {
        await thisDb.close();
    });

    const getPokemon = () => {
		return {
            "species": "body.species",
            "name": "body.name",
            "level": 13,
            "genre": "body.genre",
            "size": 30,
            "weight": 20,
            "shiny": false,
            "gender": "M",
            "height": 20
        };
	};

    // const createTrainer = async () => {
    //     const admin = await CreateTrainer('Leo', 'Pokemaniac', 'leopkmn', hashSync('cynthia', 10), '1999-10-09');
    //     return admin;
    // }

    test("it should pass", async () => {
        expect(true).toBe(true);
    });

    describe("GET", () => {
        it ("Should return status code 400 with missing trainer", async () => {
            const response = await request(app).get("/users/leopkmn/pokemons");
            expect(response.statusCode).toBe(400);
        });
    });

    describe("POST", () => {
        it ("Should return status code 400 with missing trainer", async () => {
			let pokemon = getPokemon();
			const response = await request(app).post("/users/leopkmn/pokemons").send(pokemon);
            expect(response.statusCode).toBe(400);
            expect(typeof response.body).toBe('object');
        });
    });
});