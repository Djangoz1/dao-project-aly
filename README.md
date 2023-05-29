
#### Par avance pardon pour mon code qui manque sans doute un peu d'organisation.
 - Vous pouvez retrouver le contrat tel qu'il était demandé (et monolithique) dans le dossier `contracts/original/Voting.sol`
 - Pour aller plus loin, j'ai créer une dapp en essayant une modularité dans mes fichiers contrats et j'ai mis en place une "usine de contrat voting". C'est cette usine qu'hardhat déploie et la dapp s'occupe de déployer les contrats voting.

### 1.  Pour accéder à la dapp, commencé par initier le noeud hardhat :
- `npx hardhat node` 
***

### 2. Puis déployer le contrat :
- `npx hardhat run scripts/deploy.js --network localhost`

Le contrat déployer est `FactoryVoting.sol`. Ce contrat permet de multiplier le déploiement du contrat `Voting.sol` afin d'avoir plusieurs session de vote.
***

### 3. Ensuite modifier l'address du contrat déployer de `CONTRACT_ADDRESS` dans `constants/index.js`

Une fois cela fait, vous pouvez lancer la dApp `npm run start`

### 4. Assurez-vous d'être sur l'ID de chaîne 1337 pour intéragir avec le contrat 

***

## Quelques conditions

**Pour déployer un nouveau contrat voting** : *Il n'y a aucune condition.*

**Pour ajouter quelqu'un à la whitelist** : *Il faut être le owner.*

**Pour passer à l'étape `ProposalsRegistrationStarted`** : *Il faut au moins **3 whitelistés** pour que le vote soit pertinent et qu'une majorité puisse (potentiellement) se dégager.*

**Pour passer à l'étape `ProposalsRegistrationEnded`** : *Il faut au moins 2 propositions pour qu'il y ait un choix et qu'une majorité puisse (potentiellement) se dégager.*

**Pour passer à l'étape `VotingSessionEnded`** : *Il faut au moins 3 votes pour qu'il y ait un résultat qui soit un minimum pertinent.*

***
## Ce qui pourrait être amélioré

- Optimiser le contrat pour réduire les frais de gaz à chaque déploiement
- On pourrais faire un arbre de merkle  pour prouver la whitelist de chaque contrat voting 
- On pourrais faire un deuxième tour de vote en cas d'égalité et ne garder que les propositions qui sont à égalité pour restreindre le choix de vote 
- Les bugs  du front
