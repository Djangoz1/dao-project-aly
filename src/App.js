import Voting from "./artifacts/contracts/Voting.sol/Voting.json";

import { useEffect, useState } from "react";
import { ConnectBtn } from "./components/ConnectBtn";
import { ethers } from "ethers";
import { _fetchOwner, fetchOwner } from "./utils";
import { Admin } from "./sections/Admin";
import { CONTRACT_ADDRESS } from "./constants";

function App() {
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [address, setAddress] = useState();
  const [owner, setOwner] = useState();
  const [isContract, setIsContract] = useState();

  const [ownerAccess, setOwnerAccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (owner === address) {
      console.log(true);
      setOwnerAccess(true);
    }
  }, [owner, address]);

  async function fetchData() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Voting.abi,
        provider
      );

      try {
        const cost = await contract.cost();
        const totalSupply = await contract?.totalSupply();
        const object = { cost: String(cost), totalSupply: String(totalSupply) };
        console.log("test", contract);
        setIsContract(contract);
        setData(object);
      } catch (err) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    const getOwner = async () => {
      if (!owner) {
        const _owner = await _fetchOwner();
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
      <div className="mt-[25vh] w-[90%] mx-auto text-center">
        {ownerAccess && <Admin data={data} isContract={isContract} />}
        Connect to enter DAO
        <p>Propriétaire : {owner}</p>
      </div>
    </div>
  );
}

export default App;
