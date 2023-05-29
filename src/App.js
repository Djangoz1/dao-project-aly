import { useEffect, useState } from "react";
import { ConnectBtn } from "./components/ConnectBtn";

import { Voters } from "./sections/Voters";
import { CONTRACT_ADDRESS, WORKFLOW_STATUS } from "./constants";
import { Proposals } from "./sections/Proposals";
import {
  doOwnerState,
  doUserState,
  doVotingFactory,
  useAuthDispatch,
  useAuthState,
} from "./context/auth";

import { Factory } from "./sections/Factory";

import { EtapButton } from "./components/EtapButtons";
import { _getWinner } from "utils";
import { Winner } from "sections/Winner";

function App() {
  const { user, factory, targetContract, workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();
  const [isUser, setIsUser] = useState();

  useEffect(() => {
    if (user) {
      setIsUser(user);
    }
  }, [user]);

  useEffect(() => {
    doOwnerState(dispatch, targetContract).then((_owner) => {
      doUserState(dispatch, _owner, targetContract);
    });
  }, [targetContract]);

  useEffect(() => {
    if (!factory) doVotingFactory(dispatch);
  }, [factory]);

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 min-h-screen  w-screen ">
      <header className="flex items-center justify-between w-[90%] mx-auto pt-[4vh]">
        <div className="flex flex-col">
          <h1 className="primary-font  font-black text-2xl text-shadow text-white flex">
            D
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[30px]  h-[30px] -mx-1"
              viewBox="0 0 320 512"
            >
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
            </svg>
            O Project
          </h1>
          <span className="text-[8px] text-gray-400"> {CONTRACT_ADDRESS}</span>
        </div>
        <ConnectBtn user={isUser} setter={() => doUserState(dispatch)} />
      </header>
      <div className="mt-[2vh] w-[95%] h-[80vh] flex  mx-auto shadow-2xl text-center rounded-lg overflow-hidden bg-zinc-950">
        <Factory />
        <div className="flex flex-col h-full overlflow-y-scroll relative w-full">
          <div className="bg-zinc-700 w-full p-2 text-white">
            Voting contract manager
          </div>
          {targetContract ? (
            <>
              <div className="m-5 ">
                <EtapButton user={user} />
              </div>
              <div className="h-full overflow-y-scroll px-5 pb-5 box-border">
                {workflowStatus === WORKFLOW_STATUS.length - 1 && <Winner />}
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
