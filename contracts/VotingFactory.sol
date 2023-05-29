// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Voting.sol";

contract VotingFactory {
    // ? Tableau des contrats Voting
    Voting[] votingContracts;

    function createVotingContract() public returns (address) {
        // ? Création d'une nouvelle instance de contrat
        Voting v = new Voting(msg.sender);
        // ? Ajout du contat voting dans le tableau
        votingContracts.push(v);
        return address(v);
    }

    function getAllVotingContracts() public view returns (Voting[] memory) {
        return votingContracts;
    }
}
