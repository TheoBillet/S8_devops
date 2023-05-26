import { randomBytes, scryptSync } from "crypto";

function GenerateClientId(size = 32, format = 'base64') {
    const buffer = randomBytes(size);
    return buffer.toString(format);
}

function GenerateClientSecret(client_id) {
    const salt = randomBytes(8).toString('hex');
    return `${scryptSync(client_id, salt, 64).toString('hex')}.${salt}`;
}