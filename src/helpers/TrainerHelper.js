import { GetTrainerByLogin } from "../managers/TrainerManager.js";

export const TRAINER_PARAM = "last_name (string), first_name (string), login (string), password (string), birthday (string format 'yyyy-mm-dd' optional)"

export function CheckLastName(last_name) {
    if (!last_name)
        throw new Error("last_name parameter doesn't exist");
    if (typeof last_name != "string")
        throw new Error("last_name parameter isn't string");
    if (last_name.length > 255)
        throw new Error("last_name parameter is too long");
}

export function CheckFirstName(first_name) {
    if (!first_name)
        throw new Error("first_name parameter doesn't exist");
    if (typeof first_name != "string")
        throw new Error("first_name parameter isn't string");
    if (first_name.length > 255)
        throw new Error("first_name parameter is too long");
}

export function CheckLogin(login) {
    if (!login)
        throw new Error("login parameter doesn't exist");
    if (typeof login != "string")
        throw new Error("login parameter isn't string");
    if (login.length > 255)
        throw new Error("login parameter is too long");
}

export function CheckPassword(password) {
    if (!password)
        throw new Error("password parameter doesn't exist");
    if (typeof password != "string")
        throw new Error("password parameter isn't string");
    if (password.length > 255)
        throw new Error("password parameter is too long");
}

export function CheckBirthday(birthday) {
    if (!birthday)
        return; 
    if (typeof birthday != "string")
        throw new Error("birthday parameter isn't string");
    if (!/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(birthday))
        throw new Error("birthday hasn't the good format: yyyy-mm-dd");
}

export async function CheckLoginExist(login) {
    if (!login)
        throw new Error("userId parameter doesn't exist");
    if (typeof login != 'string')
        throw new Error("userId isn't string");
    const trainer = await GetTrainerByLogin(login);
    if (!trainer)
        throw new Error("Trainer not found with this userId");
    return trainer;
}

export function CheckUserInformation(params) {
    CheckLastName(params.last_name);
    CheckFirstName(params.first_name);
    CheckLogin(params.login);
    CheckPassword(params.password);
    CheckBirthday(params.birthday);
}