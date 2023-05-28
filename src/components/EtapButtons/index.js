import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { WORKFLOW_STATUS } from "../../constants";
import {
  doWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { _setWorkflowStatus } from "../../utils";
import Voting from "artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
import { AlertEvent } from "components/AlertEvent";

export const EtapButton = () => {
  const { targetContract, workflowStatus, user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [event, setEvent] = useState(null);
  const handleChangeStatus = async (_newStatusId) => {
    await _setWorkflowStatus(_newStatusId - 1, _newStatusId, targetContract);

    getEvent();
    doWorkflowStatusState(dispatch, targetContract);
  };

  const manageWorkflowStatus = (_index) => {
    if (_index === workflowStatus) {
      return "btn-active";
    } else if (workflowStatus + 1 !== _index) {
      return "btn-disabled";
    }
  };

  const getEvent = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, Voting.abi, signer);
      contract.on("WorkflowStatusChange", (previousStatus, nextStatus) =>
        setEvent([previousStatus, nextStatus])
      );
    }
  };

  return (
    <div className="btn-group btn-group-horizontal overflow-x-scroll ">
      {WORKFLOW_STATUS?.map((e, i) => (
        <button
          className={`btn ${
            user?.owner && " cursor-default"
          } btn-xs ${manageWorkflowStatus(i)}`}
          key={uuidv4()}
          onClick={() => handleChangeStatus(i)}
          // onClick={() => (user?.owner ? handleChangeStatus(i) : null)}
        >
          {e}
        </button>
      ))}

      {event && (
        <AlertEvent
          event={
            <>
              Contract Voting from
              <span className="underline font-black">
                {WORKFLOW_STATUS[event?.[0]]}
              </span>
              to
              <span className="underline font-black">
                {WORKFLOW_STATUS[event?.[1]]}
              </span>
            </>
          }
          setEvent={setEvent}
        />
      )}
    </div>
  );
};
