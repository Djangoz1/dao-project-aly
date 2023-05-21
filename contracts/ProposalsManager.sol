// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// import "./WhitelistManager.sol";
import "./WorkflowStatusManager.sol";

// * Contrat proposal
contract ProposalsManager is WorkflowStatusManager {
    // ? Les informations d'une proposition est sa déscription et son nombre de vote
    struct Proposal {
        string description;
        uint voteCount;
    }
    // ? Les propositions sont tous réunis dans une liste
    Proposal[] proposals;

    // ? Fonction setter proposals avec un require sur l'acces au processus de vote
    function addProposal(
        string memory _description
    ) public checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        proposals.push(Proposal(_description, 0));
        // ? Étant le dernier a avoir push l'id est = à ...
        uint _id = proposals.length - 1;
        emit ProposalRegistered(_id);
    }

    // ? Fonction getter de toutes les propositions
    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
