import { ListVoters } from "../../components/ListVoters";
import React, { useEffect } from "react";

import { EtapButton } from "../../components/EtapButtons";
import {
  doWhitelistState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { InputVoter } from "../../components/ListVoters/InputVoter";
// 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
// 0x90f79bf6eb2c4f870365e785982e1f101e93b906
// 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65
// 0xa0ee7a142d267c1f36714e4a8f75612f20a79720
// 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f
// 0xbcd4042de499d14e55001ccbb24a551f3b954096

//METAMASK
// 0xdD2FD4581271e230360230F9337D5c0430Bf44C0
// 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199
export const Voters = ({ user }) => {
  const { whitelist, workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (!whitelist) {
      doWhitelistState(dispatch);
    }
  }, [whitelist]);

  return (
    <div className=" flex flex-col">
      <h2>Admin Section</h2>
      <EtapButton user={user} />
      <div className="flex items-end justify-between">
        {workflowStatus === 0 && user?.owner ? (
          <InputVoter />
        ) : (
          "Registration voters is closed"
        )}
      </div>
      <ListVoters user={user} />
    </div>
  );
};
