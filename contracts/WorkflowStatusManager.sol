// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// * Contrat workflow status
// ? Manage status

contract WorkflowStatusManager {
    uint numberWhitelisted;
    uint numberVoters;
    uint globalCounterVote;

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    WorkflowStatus public defaultStatus;

    // ? Event relatif au changement de status
    event VoterRegistered(address voter);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    // ? Event relatif au changement de value
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    // ? Faire un modifier pour s'assurer que l'on est à la bonne étape du processus
    modifier checkWorkflowStatus(WorkflowStatus _status) {
        require(
            defaultStatus == _status,
            "you can't do this action on this step of processus vote"
        );
        _;
    }

    // ? Fonction factorielle de changement de status
    // ! Est appeler par mon contrat principal
    function changeStatus(
        WorkflowStatus _oldStatus,
        WorkflowStatus _newStatus
    ) internal checkWorkflowStatus(_oldStatus) {
        // S'assurer qu'on est à la bonne étape du processus de vote
        emit WorkflowStatusChange(_oldStatus, _newStatus);
        defaultStatus = _newStatus;
    }
}
