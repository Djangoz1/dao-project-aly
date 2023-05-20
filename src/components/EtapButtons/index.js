import React, { useEffect, useState } from "react";
import { _getWorkflowStatus, _setWorkflowStatus } from "../../utils";
import { WORKFLOW_STATUS } from "../../constants";
import {
  doWorkflowStatusState,
  setWorkflowStatusState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

export const EtapButton = () => {
  //// const [workflowStatusId, setWorkflowStatus] = useState(0);
  const { workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    doWorkflowStatusState(dispatch);
  }, []);

  const handleChangeStatus = (_newStatusId) => {
    setWorkflowStatusState(dispatch, _newStatusId);
  };

  const manageWorkflowStatus = (_index) => {
    for (let index = 0; index < WORKFLOW_STATUS.length; index++) {
      const element = WORKFLOW_STATUS[index];
      if (element === workflowStatus) {
        if (_index === index) {
          return "btn-active";
        } else if (_index < index || _index > index + 1) {
          return "btn-disabled";
        }
      }
    }
  };

  return (
    <div className="btn-group btn-group-vertical">
      {WORKFLOW_STATUS?.map((e, i) => (
        <button
          className={`btn btn-xs ${manageWorkflowStatus(i)}`}
          key={e}
          onClick={() => handleChangeStatus(i)}
        >
          {e}
        </button>
      ))}
    </div>
  );
};
