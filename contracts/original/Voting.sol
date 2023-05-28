// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
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

    uint numberWhitelisted;
    uint numberVoters;
    uint globalCounterVote;

    // ? Les informations d'un voter (d'une address) est si elle est enregistrer, si elle a voté et qui elle a voté
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    // ? Les informations d'une proposition est sa déscription et son nombre de vote
    struct Proposal {
        string description;
        uint voteCount;
    }

    Proposal winner;

    // ? Mise en place d'une liste d'address whitelisté
    address[] whitelist;

    // ? Les propositions sont toutes réunis dans une liste
    Proposal[] proposals;

    // ? Tout les voters sont inclus dans une liste et sont identifiable par leur address
    mapping(address => Voter) voters;

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

    // ? Modifier qui s'assure que l'address est bien dans la liste des voters
    modifier voterAccess() {
        require(voters[msg.sender].isRegistered, "you're not registred");
        _;
    }

    // ? Modifier pour s'assurer que l'on est à la bonne étape du processus
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
    ) internal checkWorkflowStatus(_oldStatus) {
        // S'assurer qu'on est à la bonne étape du processus de vote
        emit WorkflowStatusChange(_oldStatus, _newStatus);
        defaultStatus = _newStatus;
    }

    // ? Fonction getter de la whitelist
    function getWhitelist() external view returns (address[] memory) {
        return whitelist;
    }

    // ? Ajout d'une address à la list whitelist
    function addWhitelistedAddress(
        address _address
    ) public checkWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        // Vérifier que l'adress n'est pas l'address 0
        require(_address != address(0), "Please enter a valid address");
        // ? Utiliser le mapping voters pour récupérer directement l'address puisque les listes whitelist/voters sont identique
        require(!voters[_address].isRegistered, "address already whitelisted");

        // Inclure l'address dans les deux tableau (whitelist & voters)
        whitelist.push(_address);
        voters[_address] = Voter(true, false, 0);
        emit VoterRegistered(_address);
    }

    // ? Ouvrir la session des propositions
    function openRegisteringSessionProposal() external onlyOwner {
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

    // ? Fonction setter proposals avec un require sur l'acces au processus de vote
    function setProposal(
        string memory _description
    )
        external
        checkWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));
        //  Étant le dernier a avoir push une proposal son id est = à ...
        uint _id = proposals.length - 1;
        emit ProposalRegistered(_id);
    }

    // ? Fonction getter de toutes les propositions
    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    // ? Fermer la session des propositions
    function closeRegisteringSessionProposal() external onlyOwner {
        // S'assurer qu'il y ait au moins deux propositions pour fermer la session
        require(proposals.length >= 2, "Not enough proposal to proceed vote");
        changeStatus(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // ? Ouvrir la session des votes
    function openRegisteringSessionVote() external onlyOwner {
        // Pas de vérification nécessaire entre la fermeture des inscriptions proposals et l'ouverture des votes
        // Si ce n'est qu'on peux s'assurer que le nombre total de vote est bien à 0
        globalCounterVote = 0;
        changeStatus(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // ? On sélectionne un voter en indiquant l'address en paramètre
    function getVoter(
        address _address
    ) external view voterAccess returns (Voter memory) {
        // Vérifier que l'adress est whitelister
        require(voters[_address].isRegistered, "address is not registered");
        return voters[_address];
    }

    // ? On vote pour une proposition en indiquant l'id de la proposition en paramètre
    function setVote(
        uint _id
    )
        external
        voterAccess
        checkWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        // Vérifier que la proposition existe
        require(_id < proposals.length, "This proposal doesn't exist");
        // Vérifier que l'électeur n'a pas déjà voté
        require(!voters[msg.sender].hasVoted, "You vote is already done");

        // On ajoute sa voie au compteur de vote pour la proposition sélectionner
        proposals[_id].voteCount++;

        // Mettre à jour les informations du voter
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _id;

        globalCounterVote++;
        // On émet l'information de l'address qui a voté et de la proposition sélectionner
        emit Voted(msg.sender, _id);
    }

    // ? Fermer la session des votes
    function closeRegisteringSessionVote() external onlyOwner {
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
        // ! TROUVER UNE ISSUE
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
