// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./WorkflowStatusManager.sol";
import "./VotersManager.sol";

// * Contrat whitelist
contract WhitelistManager is WorkflowStatusManager, VotersManager {
    // ? Mise en place d'une liste d'address whitelisté
    address[] whitelist;

    // * Getter
    // ! ? Pas dans la consigne ?
    // ? Fonction getter de la whitelist
    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }

    // * Setter
    // ? Ajout d'une address à la list whitelist
    function addWhitelistedAddress(
        address _address
    ) public checkWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        // Vérifier que l'adress n'est pas l'address 0
        require(
            _address != address(0),
            "Vous n'avez pas entrer d'address valide"
        );
        // ? Utiliser le mapping voters pour récupérer directement l'address puisque les listes whitelist/voters sont identique
        require(
            !voters[_address].isRegistered,
            "address is already whitelisted"
        );

        // Inclure l'address dans les deux tableau
        whitelist.push(_address);
        voters[_address] = Voter(true, false, 0);
        emit VoterRegistered(_address);
    }
}
