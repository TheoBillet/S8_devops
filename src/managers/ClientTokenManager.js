import ClientsToken from "../models/ClientToken.js";

const TIME_USING_TOKEN = 10

export async function CreateTokenClient(token, client_id, right_list) {
    const expire_date = new Date(Date.now() + TIME_USING_TOKEN * 60000).toJSON();
    const client_token_list = []
    right_list.forEach(function(right) {
        client_token_list.push({
            authorization_code: token,
            client_id: client_id,
            expire_date: expire_date,
            id_right: right.id
        });
    });
    return await ClientsToken.bulkCreate(client_token_list,
        {
            ignoreDuplicates: true
        }
    );
}

export async function GetClientTokenByClientIdToken(client_id, token) {
    return ClientsToken.findAll({
        where: {
            client_id: client_id,
            authorization_code: token
        }
    });
}