import { CONTRACT_ADDRESS } from "../constants";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";

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

export const _fetchOwner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Voting.abi,
      provider
    );
    try {
      const owner = await contract.owner();
      if (!contract) {
        throw new Error("Contrat inaccessible");
      }
      return owner;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
export const _fetchWhitelist = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    try {
      const _whitelist = await contract.getWhitelist();
      return _whitelist;
    } catch (err) {
      //   return err;
      console.error(err);
      //   setError(err.message);
    }
  }
};

export const _getVoter = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    try {
      let overrides = {
        from: _accounts[0],
      };

      const _voter = await contract.getVoter(_address, overrides);
      return _voter;
    } catch (err) {
      return err;
    }
  }
};

export const _setWhitelist = async (_address) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    try {
      let overrides = {
        from: _accounts[0],
      };

      const _transaction = await contract.addWhitelistAddress(
        _address,
        overrides
      );
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};

export const _getWorkflowStatus = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    try {
      const _status = await contract.defaultStatus();
      return _status;
    } catch (err) {
      return err;
    }
  }
};

export const _setWorkflowStatus = async (_previousStatusId, _newStatusId) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);

    try {
      let _transaction;
      let overrides = {
        from: _accounts[0],
      };
      if (_previousStatusId === 0 && _newStatusId === 1) {
        _transaction = await contract.openRegisteringSessionProposal(overrides);
      }
      if (_previousStatusId === 1 && _newStatusId === 2) {
        _transaction = await contract.closeRegisteringSessionProposal(
          overrides
        );
      }
      if (_previousStatusId === 2 && _newStatusId === 3) {
        _transaction = await contract.openRegisteringSessionVote(overrides);
      }
      if (_previousStatusId === 3 && _newStatusId === 4) {
        _transaction = await contract.closeRegisteringSessionVote(overrides);
      }
      if (_previousStatusId === 4 && _newStatusId === 5) {
        _transaction = await contract.countVote(overrides);
      } else {
        throw new Error("You can't switch to this workflow status");
      }
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};
export const _setProposals = async (_description) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    console.log(contract);
    try {
      if (!_description) {
        throw new Error("You must add description");
      }

      let overrides = {
        from: _accounts[0],
      };

      const _transaction = await contract.addProposal(_description, overrides);
      console.log("--------", _transaction);
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};
export const _getProposals = async () => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
    console.log(contract);
    try {
      //   if (!_description) {
      //     throw new Error("You must add description");
      //   }
      let overrides = {
        from: _accounts[0],
      };

      const _proposals = await contract.getProposals(overrides);

      return _proposals;
    } catch (err) {
      return err;
    }
  }
};

export const _votingProposal = async (_proposalId) => {
  if (typeof window.ethereum !== "undefined") {
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);

    try {
      //   if (!_description) {
      //     throw new Error("You must add description");
      //   }
      let overrides = {
        from: _accounts[0],
      };
      console.log(_proposalId, _accounts[0]);
      const _proposals = await contract.voteProposal(_proposalId, overrides);
      await _proposals.wait();
    } catch (err) {
      return err;
    }
  }
};

async function _requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}
