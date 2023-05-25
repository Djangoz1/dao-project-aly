import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { doUserState, useAuthDispatch, useAuthState } from "../context/auth";

export const ConnectBtn = ({ setter }) => {
  const { user } = useAuthState();
  // const dispatch = useAuthDispatch();

  // const [isUser, setIsUser] = useState();
  // useEffect(() => {
  //   if (!user) {
  //     doUserState(dispatch);
  //   }
  //   if (!isUser && user) {
  //     setIsUser(user);
  //   }
  // }, [user]);

  return (
    <div className="btn " onClick={setter}>
      {!user?.address ? "Se connecter" : user?.address}
    </div>
  );
};
