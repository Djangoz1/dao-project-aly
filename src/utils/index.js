import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
import VotingFactory from "../artifacts/contracts/VotingFactory.sol/VotingFactory.json";
import { CONTRACT_ADDRESS } from "../constants";

export const _getAccount = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return result[0];
    } catch (error) {
      return error;
    }
  }
};

export const _getContractFactory = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      VotingFactory.abi,
      provider
    );

    try {
      const votingFactory = await contract.getAllVotingContracts();

      return votingFactory;
    } catch (err) {
      return err;
    }
  }
};

export const _setContractFactory = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      VotingFactory.abi,
      signer
    );
    try {
      const votingFactory = await contract.createVotingContract();
      await votingFactory.wait();
    } catch (err) {
      return err;
    }
  }
};

export const _fetchOwner = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(_address, Voting.abi, provider);

    const owner = await contract.owner();
    try {
      if (!contract) {
        throw new Error("Contrat inaccessible");
      }
      return owner;
    } catch (err) {
      return err;
    }
  }
};
export const _getWhitelist = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_address, Voting.abi, signer);
    try {
      const _whitelist = await contract.getWhitelist();
      return _whitelist;
    } catch (err) {
      return err;
    }
  }
};

export const _getVoter = async (_address, _contract) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const contract = new ethers.Contract(_contract, Voting.abi, provider);

    try {
      const _voter = await contract.getVoter(_address);

      return _voter;
    } catch (err) {
      return err;
    }
  }
};

export const _setWhitelist = async (_address, _contract) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_contract, Voting.abi, signer);

    try {
      let overrides = {
        from: _accounts[0],
      };

      const _transaction = await contract.addWhitelistedAddress(
        _address,
        overrides
      );
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};

export const _getWorkflowStatus = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_address, Voting.abi, signer);

    try {
      const _status = await contract.defaultStatus();
      return _status;
    } catch (err) {
      return err;
    }
  }
};

export const _setWorkflowStatus = async (
  _previousStatusId,
  _newStatusId,
  _address
) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_address, Voting.abi, signer);

    try {
      let _transaction;
      let overrides = {
        from: _accounts[0],
      };
      if (_previousStatusId === 0 && _newStatusId === 1) {
        _transaction = await contract.openRegisteringSessionProposal();
      } else if (_previousStatusId === 1 && _newStatusId === 2) {
        _transaction = await contract.closeRegisteringSessionProposal(
          overrides
        );
      } else if (_previousStatusId === 2 && _newStatusId === 3) {
        _transaction = await contract.openRegisteringSessionVote(overrides);
      } else if (_previousStatusId === 3 && _newStatusId === 4) {
        _transaction = await contract.closeRegisteringSessionVote(overrides);
      } else if (_previousStatusId === 4 && _newStatusId === 5) {
        _transaction = await contract.countVote(overrides);
      } else {
      }

      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};
export const _setProposals = async (_description, _address) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_address, Voting.abi, signer);

    try {
      if (!_description) {
        throw new Error("You must add description");
      }
      let overrides = {
        from: _accounts[0],
      };
      const _transaction = await contract.addProposal(_description, overrides);
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};
export const _getProposals = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const contract = new ethers.Contract(_address, Voting.abi, provider);

    try {
      const _proposals = await contract.getProposals();

      return _proposals;
    } catch (err) {
      return err;
    }
  }
};

export const _votingProposal = async (_proposalId, _address) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(_address, Voting.abi, signer);

    try {
      let overrides = {
        from: _accounts[0],
      };

      const _proposals = await contract.settingVote(_proposalId, overrides);
      await _proposals.wait();
    } catch (err) {
      return err;
    }
  }
};
