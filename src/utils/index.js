import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
const DAOaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const fetchOwner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(DAOaddress, Voting.abi, provider);

    try {
      const owner = await contract.owner();
      return owner;
    } catch (err) {
      return err;
      //   setError(err.message);
    }
  }
};
