import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { WORKFLOW_STATUS } from "../../constants";
import {
  doWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { _setWorkflowStatus } from "../../utils";

export const EtapButton = () => {
  const { targetContract, workflowStatus, user } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleChangeStatus = async (_newStatusId) => {
    await _setWorkflowStatus(_newStatusId - 1, _newStatusId, targetContract);

    doWorkflowStatusState(dispatch, targetContract);
  };

  const manageWorkflowStatus = (_index) => {
    if (_index === workflowStatus) {
      return "btn-active";
    } else if (workflowStatus + 1 !== _index) {
      return "btn-disabled";
    }
  };

  return (
    <div className="btn-group btn-group-horizontal overflow-x-scroll ">
      {WORKFLOW_STATUS?.map((e, i) => (
        <button
          className={`btn ${
            user?.owner && " cursor-default"
          } btn-sm ${manageWorkflowStatus(i)}`}
          key={uuidv4()}
          onClick={() => (user?.owner ? handleChangeStatus(i) : null)}
        >
          {e}
        </button>
      ))}
    </div>
  );
};
