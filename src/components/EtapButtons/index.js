import React from "react";
import { v4 as uuidv4 } from "uuid";

import { WORKFLOW_STATUS } from "../../constants";
import {
  doWorkflowStatusState,
  setWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

export const EtapButton = ({ user }) => {
  const { workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleChangeStatus = async (_newStatusId) => {
    await setWorkflowStatusState(dispatch, _newStatusId);
    doWorkflowStatusState(dispatch);
  };

  const manageWorkflowStatus = (_index) => {
    if (_index === workflowStatus) {
      return "btn-active";
    } else if (workflowStatus + 1 !== _index) {
      return "btn-disabled";
    }
  };

  return (
    <div className="btn-group btn-group-vertical">
      {WORKFLOW_STATUS?.map((e, i) => (
        <button
          className={`btn ${
            user?.owner && " cursor-default"
          } btn-xs ${manageWorkflowStatus(i)}`}
          key={uuidv4()}
          onClick={() => (user?.owner ? handleChangeStatus(i) : null)}
        >
          {e}
        </button>
      ))}
    </div>
  );
};
