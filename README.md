# PC_PROJET_POKEMON

Quentin Guyot, Théo Billet EXP2

# Stack Technique

## Base de données

Tout d'abord, nous avons pris MySQL comme choix principal, car nous avons déjà travaillé auparavant avec du MySQL. Lors de la connexion à la base de données, des erreurs sont apparues avec l'erreur 'ECONN_REFUSED'. Après plusieurs essais à régler le problème, nous avons essayé sur postgresql qui a fonctionné directement donc, nous travailleront sur du postgresql.

## Langage de programmation
Nous n'avions jamais fait de TypeScript alors, nous restons sur du Javascript où l'on a déjà travaillé avec ce langage.

## Package de test
Nous utilisons jest car très simple à utiliser

## Package de qualité de code
Nous utilisons eslint car très simple à utiliser

# Architecture

## Docker
Un fichier 'Dockerfile' pour notre image de l'application
Un fichier 'docker-compose.yml' pour la gestion des dockers

## Database
Un dossier 'database' contenant les scripts sql qui seront exécutés au premier lancement de la base de données

## Test
Un dossier 'tests' pour y mettre les différents dossiers/fichiers tests

## Source
Un dossier 'src' qui contiendra tout le source de l'application, qui aura un dossier :
- helpers qui contiendra nos fonctions pour alléger le code
- managers qui contiendra nos fonctions qui intéragiront avec la BDD et nos models
- models pour les classes représantant les tables de BDD
- routers pour les handlers des différents endpoints

# Lancement du projet
Il faut au préalable docker et npm d'installés.
Afin de démarrer le serveur lancer la commande suivante : docker compose up

# Scripts npm
- npm run start pour lancer le serveur
- npm run test pour lancer les tests
- npm run test_code pour tester la qualité du code

# Bonus
Quentin Guyot: est-il possible d'avoir une véritable correction de l'implémentation OAuth2 avec les différents schéma de BDD, le code de gestion de tous les erreurs possibles ? 
J'ai vu qu'il y avait une redirection vers '/token' dans '/authorize', mais cela est du POST sachant que /authorize est du GET. On ne peut pas rediriger, non ?