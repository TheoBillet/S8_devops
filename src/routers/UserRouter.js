import { Router } from "express";
import { CreateTrainer, DeleteTrainer, GetTrainerByLogin, GetTrainerList, UpdateTrainer } from "../managers/TrainerManager.js";
import { CheckBirthday, CheckFirstName, CheckLastName, CheckLoginExist, CheckUserInformation } from "../helpers/TrainerHelper.js";
import { CheckRights } from "../helpers/RightHelper.js";
import { GetAllRightsByName } from "../managers/RightManager.js";
import { AddRightsToTrainer, DeleteAllRightsToTrainer } from "../managers/TrainerRightManager.js";
import { hashSync } from "bcrypt";

export const UserRouter = Router();

UserRouter.post('/', async (req, res) => {
    // Need to check users:create
    try {
        CheckUserInformation(req.body);
        await CheckRights(req.body.rights);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    const { last_name, first_name, login, password, birthday, rights } = req.body;
    let trainer = await GetTrainerByLogin(login);
    if (trainer)
        return res.status(400).send('Trainer already exists, please change your login');

    trainer = await CreateTrainer(last_name, first_name, login, hashSync(password, 10), birthday);
    const right_list = await GetAllRightsByName(rights);
    await AddRightsToTrainer(right_list, trainer);
    return res.sendStatus(200);
});

UserRouter.get('/', async (req, res) => {
    // Need to check user:read
    var { page, pageSize } = req.query;
    if (!page || !(/^\d+$/.test(page)))
        page = 0;
    else
        page = Number(page);
    if (!pageSize || !(/^\d+$/.test(pageSize)))
        pageSize = 20;
    else
        pageSize = Number(pageSize);

    return res.status(200).send(await GetTrainerList(page, pageSize));
});

UserRouter.get('/:userId', async (req, res) => {
    // Need to check user:read
    const login = req.params.userId;
    let trainer;
    try {
        trainer = await CheckLoginExist(login);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    
    return res.status(200).send(trainer);
});

UserRouter.put('/:userId', async (req, res) => {
    // Need to check users:update:self
    const { last_name, first_name, birthday } = req.body;
    let trainer;
    try {
        trainer = await CheckLoginExist(req.params.userId);
        CheckLastName(last_name);
        CheckFirstName(first_name);
        CheckBirthday(birthday);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    trainer.last_name = last_name;
    trainer.first_name = first_name;
    trainer.birthday = birthday;

    await UpdateTrainer(trainer);
    return res.sendStatus(200);
});

// UserRouter.put('/:userId', async (req, res) => {
//     // Need to check users:update:all
//     const { last_name, first_name, birthday, rights } = req.body;
//     let trainer;
//     try {
//         trainer = await CheckLoginExist(req.params.userId);
//         CheckLastName(last_name);
//         CheckFirstName(first_name);
//         CheckBirthday(birthday);
//         await CheckRights(rights);
//         right_list = await GetAllRightsByName(rights);
//         await DeleteAllRightsToTrainer(trainer);
//         await AddRightsToTrainer(right_list, trainer);
//     } catch (e) {
//         return res.status(400).send(String(e));
//     }
//     trainer.last_name = last_name;
//     trainer.first_name = first_name;
//     trainer.birthday = birthday;

//     await UpdateTrainer(trainer);
//     return res.sendStatus(200);
// });

UserRouter.patch('/:userId', async (req, res) => {
    // Need to check users:update:self
    const { last_name, first_name, birthday } = req.body;
    let trainer;
    try {
        trainer = await CheckLoginExist(req.params.userId);
        if (last_name)
        {
            CheckLastName(last_name);
            trainer.last_name = last_name;
        }
        if (first_name)
        {
            CheckFirstName(first_name);
            trainer.first_name = first_name;
        }
        if (birthday)
        {
            CheckBirthday(birthday);
            trainer.birthday = birthday;
        }
    } catch (e) {
        return res.status(400).send(String(e));
    }

    await UpdateTrainer(trainer);
    return res.sendStatus(200);
});

// UserRouter.patch('/:userId', async (req, res) => {
//     // Need to check users:update:all
//     const { last_name, first_name, birthday, rights } = req.body;
//     let trainer, right_list;
//     try {
//         trainer = await CheckLoginExist(req.params.userId);
//         if (last_name)
//         {
//             CheckLastName(last_name);
//             trainer.last_name = last_name;
//         }
//         if (first_name)
//         {
//             CheckFirstName(first_name);
//             trainer.first_name = first_name;
//         }
//         if (birthday)
//         {
//             CheckBirthday(birthday);
//             trainer.birthday = birthday;
//         }
//         if (rights)
//         {
//             await CheckRights(rights);
//             right_list = await GetAllRightsByName(rights);
//             await AddRightsToTrainer(right_list, trainer);
//         }
//     } catch (e) {
//         return res.status(400).send(String(e));
//     }

//     await UpdateTrainer(trainer);
//     return res.sendStatus(200);
// });

UserRouter.delete('/:userId', async (req, res) => {
    // Need to check users:delete:self
    const login = req.params.userId;
    let trainer;
    try {
        trainer = await CheckLoginExist(login);
    } catch (e) {
        return res.status(404).send(String(e));
    }

    await DeleteTrainer(login);

    return res.sendStatus(200);
});

// UserRouter.delete('/:userId', async (req, res) => {
//     // Need to check users:delete:all
//     const login = req.params.userId;
//     let trainer;
//     try {
//         trainer = await CheckLoginExist(login);
//     } catch (e) {
//         return res.status(404).send(String(e));
//     }

//     await DeleteTrainer(login);

//     return res.sendStatus(200);
// });