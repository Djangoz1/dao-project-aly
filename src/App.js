import { useEffect, useState } from "react";
import { ConnectBtn } from "./components/ConnectBtn";

import { Voters } from "./sections/Voters";
import { CONTRACT_ADDRESS } from "./constants";
import { Proposals } from "./sections/Proposals";
import {
  doOwnerState,
  doUserState,
  doWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "./context/auth";

function App() {
  const { user, owner, workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();
  const [isUser, setIsUser] = useState();
  useEffect(() => {
    if (user) {
      setIsUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (!workflowStatus >= 0) {
      doWorkflowStatusState(dispatch);
    }
  }, [workflowStatus]);

  useEffect(() => {
    if (!owner && !user) {
      doOwnerState(dispatch).then(
        (_owner) => _owner && doUserState(dispatch, _owner)
      );
    }
  }, [owner, user?.address]);

  return (
    <div className="bg-blue-900 min-h-screen w-screen overflow-x-hidden">
      <header className="flex items-center justify-between w-[90%] mx-auto pt-[4vh]">
        <h1>DAO Project</h1>
        <ConnectBtn user={isUser} setter={() => doUserState(dispatch)} />
      </header>
      <div className="mt-[2vh] w-[90%] mx-auto text-center">
        <Voters user={isUser} />
        <Proposals user={isUser} />
        <div className="mt-[10vh]"></div>
        Connect to enter DAO
        <p>Propriétaire : {owner}</p>
        <p>Contract address : {CONTRACT_ADDRESS}</p>
      </div>
    </div>
  );
}

export default App;
