import app from '../app.js';
import request from "supertest";
import db from "../src/Database.js";
import { CreateTrainer } from '../src/managers/TrainerManager.js';


describe('Test Trainer', () => {
    let thisDb = db;

	beforeAll(async () => {
		await thisDb.sync({ force: true });
        await createTrainer();
	})

    afterAll(async () => {
        await thisDb.close();
    });

    const createTrainer = async () => {
        const admin = await CreateTrainer('Leo', 'Pokemaniac', 'leopkmn', 'cynthia', '1999-10-09');
        return admin;
    }

    describe('POST', () => {
        it("Should return status code 200", async () => {
            // const params = '?last_name=Quentin&first_name=Guyot&login=Mithy&password=lebg'
            const payload = {last_name: 'Quentin', first_name: 'Guyot', login: 'Mithy', password: 'lebg', birthday: null};
            const response = await request(app).post('/register').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
        });
        it("Should return status code 400", async () => {
            // const params = '?last_name=Quentin&first_name=Guyot&login=Mithy&password=lebg'
            const payload = {last_name: 'Quentin', first_name: 'Guyot', login: 'Mithy', password: 'lebg', birthday: null};
            await request(app).post('/register').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
            const response = await request(app).post('/register').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET', () => {
        it("Should return status code 200", async () => {
            const response = await request(app).get('/users').set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('DELETE', () => {
        it("Should return status code 200", async () => {
            const payload = {last_name: 'Quentin', first_name: 'Guyot', login: 'QuentinGuyot', password: 'lebg', birthday: null};
            const response_create = await request(app).post('/register').send(payload).set('Content-Type', 'application/json').set('Accept', 'application/json');
            expect(response_create.statusCode).toBe(200);
            const response_delete = await request(app).delete('/users/QuentinGuyot').set('Content-Type', 'application/json').set('Accept', 'application/json');
            expect(response_delete.statusCode).toBe(200);
        });
    });
});