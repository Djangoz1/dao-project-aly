import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";

export const ConnectBtn = ({ address, setAddress }) => {
  // Pour que metamask lui demande la connection
  async function requestAccount() {
    if (!address) {
      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(result);
    }
  }
  return (
    <div className="btn " onClick={requestAccount}>
      {!address ? "Se connecter" : address}
    </div>
  );
};
