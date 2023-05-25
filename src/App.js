import { useEffect, useState } from "react";
import { ConnectBtn } from "./components/ConnectBtn";

import { Voters } from "./sections/Voters";
import { CONTRACT_ADDRESS } from "./constants";
import { Proposals } from "./sections/Proposals";
import {
  doOwnerState,
  doUserState,
  doVotingFactory,
  doWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "./context/auth";
import { ethers } from "ethers";

import VotingFactory from "./artifacts/contracts/VotingFactory.sol/VotingFactory.json";
import { Factory } from "./sections/Factory";
import { _getContractFactory } from "./utils";
import { EtapButton } from "./components/EtapButtons";
import { InputVoter } from "./components/ListVoters/InputVoter";

function App() {
  const { user, owner, workflowStatus, factory, targetContract } =
    useAuthState();
  const dispatch = useAuthDispatch();
  const [isUser, setIsUser] = useState();
  useEffect(() => {
    if (user) {
      setIsUser(user);
    }
  }, [user]);

  // useEffect(() => {
  //   if (!workflowStatus >= 0) {
  //     doWorkflowStatusState(dispatch);
  //   }
  // }, [workflowStatus]);

  useEffect(() => {
    doOwnerState(dispatch, targetContract).then(
      () => owner && doUserState(dispatch, owner, targetContract)
    );
  }, [targetContract]);

  useEffect(() => {
    if (!factory) doVotingFactory(dispatch);
  }, [factory]);

  // useEffect(() => {
  //   if (!workflowStatus >= 0) {
  //     doWorkflowStatusState(dispatch);
  //   }
  // }, [workflowStatus]);

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 min-h-screen  w-screen ">
      <header className="flex items-center justify-between w-[90%] mx-auto pt-[4vh]">
        <h1 className="primary-font flex flex-col font-black text-2xl text-shadow text-white">
          DAO Project
          <span className="text-[8px] text-gray-400"> {CONTRACT_ADDRESS}</span>
        </h1>
        <ConnectBtn user={isUser} setter={() => doUserState(dispatch)} />
      </header>
      <div className="mt-[2vh] w-[95%] h-[80vh] flex  mx-auto shadow-2xl text-center rounded-lg overflow-hidden bg-zinc-950">
        <Factory />
        <div className="flex flex-col h-full overlflow-y-scroll relative w-full">
          {targetContract ? (
            <>
              <div className="m-5 ">
                <EtapButton user={user} />
              </div>
              <div className="h-full overflow-y-scroll px-5 pb-5 box-border">
                <Voters />
                <Proposals user={isUser} />
              </div>
            </>
          ) : (
            <p className="text-2xl text-white absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2  m-auto">
              Please select a vote
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
