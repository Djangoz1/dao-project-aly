// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WhitelistManager.sol";

// * Contrat principal
// ? Le contrat Voting hérite de Ownable et de WhitelistManager
// ? WhitelistManager hérite lui-même du contrat VotersManager
// ? VotersManager qui lui hérite de ProposalsManager
// ? Tous sont organisé selon le WorkflowStatusManager

// ? Il sert à annoncer les modalités du processus de vote
contract Voting is Ownable, WhitelistManager {
    // ? Status du processus de vote
    Proposal winner;

    //  ! constructor contract
    constructor() {
        // On part du principe que l'administrateur au vote fait partie des votants
        voters[msg.sender] = Voter(true, false, 0);
        whitelist.push(msg.sender);
        numberVoters++;
        // ? Ouvrir l'inscription au vote dès le déploiement
        emit WorkflowStatusChange(
            defaultStatus,
            WorkflowStatus.RegisteringVoters
        );
    }

    // ? Ouvrir la session des propositions

    function openRegisteringSessionProposal() public onlyOwner {
        // S'assurer qu'il y ait au moins 3 whitelisté qui soit enregistré (pour établir une majorité)
        require(
            whitelist.length >= 3,
            "Not enough whitelisted address for open session"
        );
        changeStatus(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    // ? Fermer la session des propositions
    function closeRegisteringSessionProposal() public onlyOwner {
        // S'assurer qu'il y ait au moins deux propositions pour fermer la session
        require(proposals.length >= 2, "Not enough proposal to proceed vote");
        changeStatus(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // ? Ouvrir la session des votes
    function openRegisteringSessionVote() public onlyOwner {
        // Pas de vérification nécessaire entre la fermeture des inscriptions proposals et l'ouverture des votes
        // Si ce n'est qu'on peux s'assurer que le nombre total de vote est bien à 0
        globalCounterVote = 0;
        changeStatus(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // ? Fermer la session des votes
    function closeRegisteringSessionVote() public onlyOwner {
        // S'assurer qu'il y ait plus de 2 votes pour que le vote ait une pertinence
        require(globalCounterVote > 2, "Not enough vote for close session");
        changeStatus(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    // ? Décompter les votes
    function countVote() public onlyOwner {
        // Boucler sur toutes les propositions
        for (uint _id; _id < proposals.length; _id++) {
            // Vérifier qu'il n y a pas deux gagnant
            require(
                _id == proposals.length - 1 &&
                    proposals[_id].voteCount != winner.voteCount,
                "two winner, we need to reload a new session"
            );
            // Pour récupérer celui qui a le plus grand nombre de vote
            if (winner.voteCount < proposals[_id].voteCount) {
                winner = proposals[_id];
            }
        }
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }

    // ? Fonction getter du gagnant
    function getWinner() public view returns (Proposal memory) {
        require(
            defaultStatus == WorkflowStatus.VotesTallied,
            "the count is not finish yet"
        );
        return winner;
    }
}
