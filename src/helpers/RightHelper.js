import { CountRightsExist } from "../managers/RightManager.js";

export async function CheckRights(rights) {
    if (!Array.isArray(rights))
        throw Error('rights parameter is not an array');
    rights.forEach(elt => {
        if (typeof elt != 'string')
            throw Error(`${elt} is not a string`);
    });
    if (rights.length != await CountRightsExist(rights))
        throw Error('One of the element is not a right');
}