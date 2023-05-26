DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS client_token;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS rights;
DROP TABLE IF EXISTS trainer_rights;
DROP TABLE IF EXISTS pokemons;
DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS trade_pokemon;

CREATE TABLE clients (
    client_id VARCHAR(255) PRIMARY KEY,
    client_secret VARCHAR(255) NOT NULL
);

CREATE TABLE client_token (
    authorization_code VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    expire_date TIMESTAMP NOT NULL,
    id_right SERIAL
);

CREATE TABLE trainers (
    last_name VARCHAR(255),
    first_name VARCHAR(255),
    login VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    birthday DATE
);

CREATE TABLE rights (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE trainer_rights (
    login_trainer VARCHAR(255),
    id_right SERIAL,

    CONSTRAINT FK_login_trainer FOREIGN KEY(login_trainer) REFERENCES trainers(login) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_id_right FOREIGN KEY(id_right) REFERENCES rights(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE pokemons (
    id SERIAL PRIMARY KEY,
    species VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL check (level between 1 and 100),
    gender char(1) NOT NULL check (gender in ('M', 'F', 'U')),
    height DOUBLE PRECISION NOT NULL check (height > 0),
    weight DOUBLE PRECISION NOT NULL check (weight > 0),
    shiny BOOLEAN NOT NULL,       
    login_trainer VARCHAR(255) NOT NULL,

    CONSTRAINT FK_login_trainer FOREIGN KEY(login_trainer) REFERENCES trainers(login) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    login_applicant VARCHAR(255) NOT NULL,
    login_receiver VARCHAR(255) NOT NULL,
    state char(1) NOT NULL check (state in ('P', 'A', 'R')),

    CONSTRAINT FK_login_applicant FOREIGN KEY(login_applicant) REFERENCES trainers(login) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_login_receiver FOREIGN KEY(login_receiver) REFERENCES trainers(login) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE trade_pokemon (
    id_trade SERIAL NOT NULL,
    id_pokemon SERIAL NOT NULL,
    login_trainer VARCHAR(255) NOT NULL,

    CONSTRAINT FK_id_trade FOREIGN KEY(id_trade) REFERENCES trades(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_id_pokemon FOREIGN KEY(id_pokemon) REFERENCES pokemons(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_login_trainer FOREIGN KEY(login_trainer) REFERENCES trainers(login) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO clients (client_id, client_secret) VALUES
    ('MY_BEST_APP', 'YES_BEST_APP');

INSERT INTO rights (name) VALUES 
    ('users:create'),
    ('users:read'),
    ('users:update:self'),
    ('users:update:all'),
    ('users:delete:self'),
    ('users:delete:all'),
    ('pokemons:create:self'),
    ('pokemons:create:all'),
    ('pokemons:read'),
    ('pokemons:update:self'),
    ('pokemons:update:all'),
    ('pokemons:delete:self'),
    ('pokemons:delete:all'),
    ('trade:create:self'),
    ('trade:create:all'),
    ('trade:read'),
    ('trade:update:self'),
    ('trade:update:all');