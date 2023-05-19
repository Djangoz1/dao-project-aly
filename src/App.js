import Voting from "./artifacts/contracts/Voting.sol/Voting.json";

import { useEffect, useState } from "react";
import { ConnectBtn } from "./components/ConnectBtn";
import { ethers } from "ethers";
import { fetchOwner } from "./utils";

function App() {
  const [user, setUser] = useState();
  const DAOaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [address, setAddress] = useState();
  const [owner, setOwner] = useState();
  const [isContract, setIsContract] = useState();
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(DAOaddress, Voting.abi, provider);

      setIsContract(contract);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = { cost: String(cost), totalSupply: String(totalSupply) };
        setData(object);
      } catch (err) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    const getOwner = async () => {
      if (!owner) {
        const _owner = await fetchOwner();
        setOwner(_owner);
      }
    };
    getOwner();
  }, [isContract]);
  return (
    <div className="bg-violet-700 h-screen w-screen">
      <header className="flex items-center justify-between w-[90%] mx-auto pt-[4vh]">
        <h1>DAO Project</h1>
        <ConnectBtn address={address} setAddress={setAddress} />
      </header>
      <div className="mt-[25vh] text-center">
        {/* {owner === address} */}
        Connect to enter DAO
        <p>Propriétaire : {owner}</p>
      </div>
    </div>
  );
}

export default App;
