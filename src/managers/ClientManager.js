import Client from "../models/Client.js";

export async function GetClientByClientId(client_id) {
    return await Client.findOne({
        where: {
            client_id: client_id
        }
    });
}