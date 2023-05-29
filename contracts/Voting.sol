// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "./WhitelistManager.sol";

// * Contrat principal
// ? Le contrat Voting hérite de WhitelistManager
// ? WhitelistManager hérite lui-même du contrat VotersManager
// ? VotersManager qui lui hérite de ProposalsManager
// ? Tous sont organisé selon le WorkflowStatusManager

// ? Il sert à annoncer les modalités du processus de vote
contract Voting is WhitelistManager {
    constructor(address _owner) {
        // ? L'owner est par défaut le contrat VotingFactory. Il faut donc le confier à celui qui a créer le vote
        transferOwnership(_owner);
        // On part du principe que l'administrateur au vote fait partie des votants
        whitelist.push(_owner);
        voters[_owner] = Voter(true, false, 0);

        // ? Ouvrir l'inscription au vote dès le déploiement
        emit WorkflowStatusChange(
            defaultStatus,
            WorkflowStatus.RegisteringVoters
        );
    }

    function addProposal(
        string memory _description
    )
        internal
        voterAccess
        checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        _addProposal(_description);
    }

    function settingVote(uint _id) external {
        _settingVote(_id);
        // Fermer la session automatiquement si tout le monde a voté
        if (globalCounterVote == whitelist.length - 1) {
            _closeRegisteringSessionVote();
        }
    }

    // ? Ouvrir la session des propositions

    function openRegisteringSessionProposal() external onlyOwner {
        // S'assurer qu'il y ait au moins 3 whitelisté qui soit enregistré (pour établir une majorité)
        require(
            whitelist.length >= 3,
            "Not enough whitelisted address for open session"
        );
        _changeStatus(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    // ? Fermer la session des propositions
    function closeRegisteringSessionProposal() external onlyOwner {
        // S'assurer qu'il y ait au moins deux propositions pour fermer la session
        require(proposals.length >= 2, "Not enough proposal to proceed vote");
        _changeStatus(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // ? Ouvrir la session des votes
    function openRegisteringSessionVote() external onlyOwner {
        // Pas de vérification nécessaire entre la fermeture des inscriptions proposals et l'ouverture des votes
        // Si ce n'est qu'on peux s'assurer que le nombre total de vote est bien à 0
        globalCounterVote = 0;
        _changeStatus(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // ? Fermer la session des votes
    function closeRegisteringSessionVote() external onlyOwner {
        _closeRegisteringSessionVote();
    }

    // ? Fermer la session des votes
    function _closeRegisteringSessionVote() internal {
        // S'assurer qu'il y ait plus de 2 votes pour que le vote ait une pertinence
        require(globalCounterVote > 2, "Not enough vote for close session");
        _changeStatus(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
        // Passer immédiatement au décompte des votes dès la fermeture des votes
        countVote();
    }

    // ? Décompter les votes
    function countVote() internal onlyOwner {
        _getWinner();
        _changeStatus(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
