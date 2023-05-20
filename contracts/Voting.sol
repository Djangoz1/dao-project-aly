// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    // ----------------------
    // ----------------------
    // * Déclaration
    // --

    // ? Status du processus de vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    WorkflowStatus public defaultStatus;

    // ? Event d'évènement relatif au changement de status
    event VoterRegistered(address voter);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    // ? Structure d'un électeur
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    // ? Structure d'une proposition de vote
    struct Proposal {
        string description;
        uint voteCount;
    }
    mapping(address => Voter) voters;
    Proposal[] proposals;
    Proposal winner;
    // La whitelist est composé d'address qui a été identifié
    address[] whitelist;
    // Faire une variable de counter pour savoir le nombre max de votant
    uint numberVoters;
    // Faire une variable de counter pour savoir le nombre effectif de vote
    uint globalCounterVote;

    //  ! constructor contract
    constructor() {
        // On part du principe que l'administrateur au vote fait partie des votants
        voters[msg.sender] = Voter(true, false, 0);
        whitelist.push(msg.sender);
        numberVoters++;
        // ? Ouvrir l'inscription au vote dès le déploiement
        changeStatus(defaultStatus, WorkflowStatus.RegisteringVoters);
    }

    // ? Faire un modifier pour s'assurer que l'address a bien le droit de vote
    modifier voterAccess() {
        require(voters[msg.sender].isRegistered, "you're not registred");
        _;
    }
    // ? Faire un modifier pour s'assurer que l'on est à la bonne étape du processus
    modifier checkWorkflowStatus(WorkflowStatus _status) {
        require(
            defaultStatus == _status,
            "you can't do this action on this step of processus vote"
        );
        _;
    }

    // ? Fonction factorielle de changement de status
    function changeStatus(
        WorkflowStatus _oldStatus,
        WorkflowStatus _newStatus
    ) public checkWorkflowStatus(_oldStatus) {
        // S'assurer qu'on est à la bonne étape du processus de vote
        emit WorkflowStatusChange(_oldStatus, _newStatus);
        defaultStatus = _newStatus;
    }

    // ----------------------
    // ----------------------
    // * Whitelist fonction
    // --
    // - Être whitelist signifie faire partie des voters
    // - Le getter s'occupe directement de connaître les informations du votant, mais pour cela il faut être whitelisté

    // ? Fonction setter de la whitelist
    function addWhitelistAddress(
        address _address
    ) public onlyOwner checkWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        // Vérifier que l'adress n'est pas déjà whitelister
        require(
            _address != address(0),
            "Vous n'avez pas entrer d'address valide"
        );
        require(!voters[_address].isRegistered, "address already registered");
        voters[_address].isRegistered = true;
        whitelist.push(_address);

        emit VoterRegistered(_address);
        numberVoters++;
    }

    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }

    // ? Fonction getter de la whitelist
    function getVoter(
        address _address
    ) public view voterAccess returns (Voter memory) {
        // Vérifier que l'adress est whitelister
        require(voters[_address].isRegistered, "address is not registered");
        return voters[_address];
    }

    // ----------------------
    // ----------------------
    // * Session de proposition
    // --

    // ? Ouvrir la session des propositions
    function openRegisteringSessionProposal() public onlyOwner {
        // S'assurer qu'il y ait au moins 3 votants qui soit enregistré (pour établir une majorité)
        require(numberVoters > 2, "Not enough voters for open session");
        changeStatus(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    // ? Fonction setter proposals avec un require sur l'acces au processus de vote
    function addProposal(
        string memory _description
    )
        public
        voterAccess
        checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));
        // Étant le dernier a avoir push l'id est = à ...
        uint _id = proposals.length - 1;
        emit ProposalRegistered(_id);
    }

    // ? Fermer la session des propositions
    function closeRegisteringSessionProposal() public onlyOwner {
        // S'assurer qu'il y ait au moins deux propositions pour fermer la session
        require(proposals.length >= 2, "Not enough proposal to proceed vote");
        changeStatus(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.RegisteringVoters
        );
    }

    // ----------------------
    // ----------------------
    // * Session de vote
    // --

    // ? Ouvrir la session des votes
    function openRegisteringSessionVote() public onlyOwner {
        changeStatus(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // ? Fonction setter du vote
    function voteProposal(
        uint _id
    )
        public
        voterAccess
        checkWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        // Vérifier que la proposition existe
        require(_id > proposals.length, "This proposal doesn't exist");
        // Vérifier que l'électeur n'a pas déjà voté
        require(!voters[msg.sender].hasVoted, "You vote is already done");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _id;
        proposals[_id].voteCount++;
        globalCounterVote++;
        emit Voted(msg.sender, _id);
    }

    // ? Fermer la session des votes
    function closeRegisteringSessionVote() public onlyOwner {
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
        changeStatus(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }

    // ? Fonction getter du gagnant
    function getWinner() public view returns (Proposal memory) {
        require(
            defaultStatus == WorkflowStatus.VotesTallied,
            "the count is not over yet"
        );
        return winner;
    }
}
