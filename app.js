import express from 'express';
import { hashSync } from 'bcrypt';
import fs from 'fs';

import Right from './src/models/Right.js';
import Trainer from './src/models/Trainer.js';
import { CreateTrainer, GetTrainerByLogin } from './src/managers/TrainerManager.js';
import { GetAllRights, GetAllRightsWhereContaining } from './src/managers/RightManager.js';
import { AddRightsToTrainer } from './src/managers/TrainerRightManager.js';
import { TRAINER_PARAM, CheckUserInformation } from './src/helpers/TrainerHelper.js';
import { UserRouter } from './src/routers/UserRouter.js';
import { PokemonRouter } from './src/routers/PokemonRouter.js';
import { TradeRouter } from './src/routers/TradeRouter.js';
import { TradeUserRouter } from './src/routers/TradeUserRouter.js';
import swaggerUI from 'swagger-ui-express';

const app = express();
app.use(express.json());
// app.use('/oauth2', AuthenticationRouter)
app.use('/users', UserRouter);
app.use('/users', PokemonRouter);
app.use('/users', TradeUserRouter);
app.use('/trade', TradeRouter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./swagger.json'))));

app.post('/register', async (req, res) => {
    if (!req.body || !Object.keys(req.body).length)
        return res.status(404).send('There is no parameter in the body. Please send params: ' + TRAINER_PARAM);

    try {
        CheckUserInformation(req.body);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    const { last_name, first_name, login, password, birthday } = req.body;
    var trainer = await GetTrainerByLogin(login);
    if (trainer)
        return res.status(400).send('Trainer already exists, please change your login');
    
    var trainer = await CreateTrainer(last_name, first_name, login, hashSync(password, 10), birthday);
    await AddRightsToTrainer(await GetAllRightsWhereContaining(['read', 'self'], 'logs'), trainer);

    return res.sendStatus(200);
});

app.use((req, res) => {
    return res.sendStatus(404);
});


export default app;