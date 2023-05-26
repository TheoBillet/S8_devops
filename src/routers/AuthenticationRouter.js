import { Router } from "express";
import { GetClientByClientId } from "../managers/ClientManager.js";
import { CheckIfRightsExists } from "../managers/RightManager.js";
import { randomUUID } from "crypto";
import { CreateTokenClient, GetClientTokenByClientIdToken } from "../managers/ClientTokenManager.js";
import { GetTrainerByLogin } from "../managers/TrainerManager.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { GetAllRightsByName } from "../managers/RightManager.js";

export const AuthenticationRouter = Router()

AuthenticationRouter.get('/authorize', async (req, res) => {
    const { client_id, redirect_uri, right_list } = req.query;

    if (!client_id)
        return res.status(404).send('client_id not found');
    const client = GetClientByClientId(client_id);
    if (!client)
        return res.status(404).send("client_id doesn't exist");

    if (!redirect_uri)
        return res.status(404).send('redirect_uri not found');
    
    if (!right_list)
        return res.status(404).send('rights_list not found');
    const right_list_parsed = JSON.parse(right_list)
    if (!Array.isArray(right_list_parsed))
        return res.status(400).send('right_list is not an array');
    for (const elt of right_list_parsed) {
        if (typeof elt != 'string')
            return res.status(400).send(`${elt} is not a string`);
    }
    const is_correct = await CheckIfRightsExists(right_list_parsed);
    if (!is_correct)
        return res.status(400).send("One of the right doesn't exist");

    const authorization_code = randomUUID().toString();
    const rights = await GetAllRightsByName(right_list_parsed);
    await CreateTokenClient(authorization_code, client_id, rights);
    
    return res.redirect(303, `${redirect_uri}?client_id=${client_id}&client_secret=${client.client_secret}&authorization_code=${authorization_code}`);
});

AuthenticationRouter.post('/token', async (req, res) => {
    const { client_id, client_secret, authorization_code } = req.query;
    const { login, password, right_list } = req.body;

    if (!client_id)
        return res.status(404).send('client_id not found');
    const client = GetClientByClientId(client_id);
    if (!client)
        return res.status(404).send("client_id doesn't exist");
    if (!client_secret)
        return res.status(404).send('client_secret not found');
    if (client.client_secret !== client_secret)
        return res.status(401).send('Application is not authorized');
    if (!authorization_code)
        return res.status(404).send("Authorization doesn't exist");
    
    const client_token = await GetClientTokenByClientIdToken(client_id, authorization_code);
    if (!client_token.length)
        return res.status(401).send('Invalid authorization code');
    
    const now = new Date(Date.now());
    if (now > client_token[0].expire_date)
        return res.status(401).send('Authorization code expired');
    
    if (!login)
        return res.status(404).send('login not found');
    if (!password)
        return res.status(404).send('password not found');
    if (!right_list)
        return res.status(404).send('right_list not found');
    if (!Array.isArray(right_list))
        return res.status(400).send('right_list is not an array');
    for (const elt of right_list) {
        if (typeof elt != 'string')
            return res.status(400).send(`${elt} is not a string`);
    }
    const trainer = await GetTrainerByLogin(login, true);
    if (!trainer)
        return res.status(404).send('trainer not found');
    if (!compareSync(password, trainer.password))
        return res.status(401).send('login or password not incorrect');
    
    const accessToken = jwt.sign({
        id: login,
        right_list
    }, 'SecretInteralPrivateKey', {
        expiresIn: '10m'
    });

    return res.status(200).send({
        accessToken,
        tokenType: 'Bearer',
        expiresIn: '10m'
    });
});