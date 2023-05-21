// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./ProposalsManager.sol";

// * Contrat voters
// ? Le contrat hérite des propositions pour qu'un voter puissent voter pour la proposition qu'il a choisi
// ! WorkflowStatusManager ait hérité depuis ProposalsManager
contract VotersManager is ProposalsManager {
    // ? Les informations d'un voter (d'une address) est si elle est enregistrer, si elle a voté et qui elle a voté
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    // ? Tout les voters sont inclus dans une liste et sont identifiable par leur address
    mapping(address => Voter) voters;

    // ? Modifier qui s'assure que l'address est bien dans la liste des voters
    modifier voterAccess() {
        require(voters[msg.sender].isRegistered, "you're not registred");
        _;
    }

    // * Getter mapping
    // ! PAS DE FONCTION GETTER sur la liste des voters, on récupèrera côté front la liste en bouclant sur le getter struct

    // * Setter mapping
    // ! PAS DE FONCTION SETTER sur la liste des voters car elle est géré par le contrat whitelist au moment du setter de la whitelist

    // * Getter struct
    // ? On sélectionne un voter en indiquant l'address en paramètre
    function getVoter(
        address _address
    ) public view voterAccess returns (Voter memory) {
        // Vérifier que l'adress est whitelister
        require(voters[_address].isRegistered, "address is not registered");
        return voters[_address];
    }

    // * Setter struct
    // ? On vote pour une proposition en indiquant l'id de la proposition en paramètre
    function settingVote(
        uint _id
    )
        public
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
}
