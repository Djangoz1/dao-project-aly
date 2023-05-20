import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { doUserState, useAuthDispatch, useAuthState } from "../context/auth";

export const ConnectBtn = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <div className="btn " onClick={() => doUserState(dispatch)}>
      {!user?.address ? "Se connecter" : user?.address}
    </div>
  );
};
