import { verify } from 'jsonwebtoken';

const checkAuthorization = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('You are not connected');
    }
    const bearerToken = authorization.split(' ');
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
        return res.status(401).send('Invalid token type');
    }
    try {
        res.locals.requestor = verify(bearerToken[1], 'SecretInternalPrivateKey');
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.redirect('/');
        }
        return res.status(500).send(err);
    }
    return next();
};

const hasRole = (role) => {
    return (req, res, next) => {
        if (res.locals.requestor.scopes !== role) {
            return res.status(403).send('You are not authorized to perform this action');
        }
        return next();
    };
};

export { hasRole, checkAuthorization };
