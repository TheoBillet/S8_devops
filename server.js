import app from "./app.js";
import sequelize_database from "./src/Database.js";
import fs from 'fs';
import { CreateTrainer } from "./src/managers/TrainerManager.js";
import { GetAllRights } from "./src/managers/RightManager.js";
import { AddRightsToTrainer } from "./src/managers/TrainerRightManager.js";
import { hashSync } from "bcrypt";

(async () => {
	try {
    // console.log("Waiting connection to database");
    await sequelize_database.authenticate();
    await sequelize_database.sync();
    // console.log('Connection has been established successfully to the database.');
	} catch (error) {
		console.log("Failed to sync db: " + error);
		throw error;
	}
})();

const port = 8080
app.listen(port, async () => {
    try {
        const admin = await CreateTrainer('Leo', 'Pokemaniac', 'leopkmn', hashSync('cynthia', 10), '1999-10-09');
        const right_list = await GetAllRights();
        await AddRightsToTrainer(right_list, admin);
    } catch (e) {
        
    }
});
