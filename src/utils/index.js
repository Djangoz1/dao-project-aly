import { CONTRACT_ADDRESS } from "../constants";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";

export const fetchOwner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Voting.abi,
      provider
    );

    try {
      const owner = await contract.owner();
      return owner;
    } catch (err) {
      console.log(")-------", err);
      return err;
      //   setError(err.message);
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
      return err;
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

// export const _setWhitelist = async (_address) => {
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       await window.ethereum.enable(); // Demande l'autorisation de se connecter au compte Ethereum du visiteur
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS,
//         Voting.abi,
//         signer
//       );

//       const isAddressValid = ethers.utils.isAddress(_address); // Vérifie si l'adresse Ethereum est valide
//       if (!isAddressValid) {
//         throw new Error("Adresse Ethereum invalide");
//       }

//       const transaction = await contract.addWhitelist(_address);
//       console.log("transaction", transaction);
//       await transaction.wait();
//     } catch (err) {
//       console.log("-------", err);
//       return err;
//     }
//   }
// };

async function _requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}
// async function setGreeting() {
//     if (!greeting) return;
//     if (typeof window.ethereum !== "undefined") {
//       // *  On va attendre que l'utilisateur ait connecté metamask
//       await _requestAccount();
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       // * Cette fois ci il faut un signers (quelqu'un qui c'est connecté à son wallet)
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
//       const transaction = await contract.setGreeting(greeting);
//       setgreetingValue("");
//       await transaction.wait();
//     }
//   }
