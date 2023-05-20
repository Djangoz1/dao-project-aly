import { CONTRACT_ADDRESS } from "../constants";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";

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
      let overrides = {
        from: _accounts[0],
      };

      const _transaction = await contract.changeStatus(
        _previousStatusId,
        _newStatusId,
        overrides
      );
      await _transaction.wait();
    } catch (err) {
      return err;
    }
  }
};

async function _requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}
