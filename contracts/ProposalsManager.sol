// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./WorkflowStatusManager.sol";

contract ProposalsManager is WorkflowStatusManager {
    // ? Les informations d'une proposition est sa déscription et son nombre de vote
    struct Proposal {
        string description;
        uint voteCount;
    }
    // ? Les propositions sont tous réunis dans une liste
    Proposal[] proposals;
    Proposal winner;

    event ProposalRegistered(uint proposalId);

    // ? Modifier qui s'assure que l'address est bien dans la liste des voters

    // ? Fonction setter proposals avec un require sur l'acces au processus de vote
    function _addProposal(
        string memory _description
    )
        internal
        checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));
        // ? Étant le dernier a avoir push l'id est = à ...
        uint _id = proposals.length - 1;
        emit ProposalRegistered(_id);
    }

    // ? Fonction getter de toutes les propositions
    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    // ? Fonction getter du gagnant exécuté à la fin de la session des votes
    function _getWinner() internal {
        // Boucler sur toutes les propositions
        for (uint _id; _id < proposals.length; _id++) {
            // Pour récupérer celui qui a le plus grand nombre de vote
            if (winner.voteCount < proposals[_id].voteCount) {
                winner = proposals[_id];
            }
        }
    }

    function getWinner() external view returns (Proposal memory) {
        // Boucler sur toutes les propositions
        require(
            winner.voteCount > 0,
            "The votes have not yet been counted, be back later"
        );
        return winner;
    }
}
