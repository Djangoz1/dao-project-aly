// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";

// * Contrat workflow status
// ? Manage status

contract WorkflowStatusManager is Ownable {
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    WorkflowStatus public defaultStatus;

    // ? ownable et globalCounterVote se place ici car WorkflowStatusManager est distribué dans tout les fichiers
    uint globalCounterVote;

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
    function _changeStatus(
        WorkflowStatus _oldStatus,
        WorkflowStatus _newStatus
    ) internal checkWorkflowStatus(_oldStatus) {
        // S'assurer qu'on est à la bonne étape du processus de vote
        emit WorkflowStatusChange(_oldStatus, _newStatus);
        defaultStatus = _newStatus;
    }
}
