import React, { useEffect, useState } from "react";
import { _getWorkflowStatus, _setWorkflowStatus } from "../../utils";
import { WORKFLOW_STATUS } from "../../constants";

export const EtapButton = () => {
  const [workflowStatus, setWorkflowStatus] = useState(0);
  const getStatus = async () => {
    const result = await _getWorkflowStatus();
    setWorkflowStatus(result);
  };
  useEffect(() => {
    getStatus();
  }, []);

  const handleChangeStatus = (_newStatusId) => {
    const _previousStatusId = _newStatusId == 0 ? 0 : _newStatusId - 1;
    _setWorkflowStatus(_previousStatusId, _newStatusId).then((e) => {
      if (!e.error) {
        setWorkflowStatus(_newStatusId);
      }
    });
  };

  return (
    <div className="btn-group btn-group-vertical">
      {WORKFLOW_STATUS?.map((e, i) => (
        <button
          className={`btn btn-xs ${i === workflowStatus ? "btn-active" : null}`}
          key={e}
          onClick={() => handleChangeStatus(i)}
        >
          {e}
        </button>
      ))}
    </div>
  );
};
