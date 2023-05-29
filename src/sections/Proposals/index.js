import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";

import { ListProposals } from "../../components/ListProposals";
import { InputProposal } from "../../components/ListProposals/InputProposal";
import { _CHECK_STATUS_PROPOSAL_OPEN } from "../../constants";
import { trackWorkflowStatus } from "utils/tools";

export const Proposals = () => {
  const { workflowStatus, targetContract, user } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (targetContract) {
      doProposalsState(dispatch, targetContract);
    }
  }, [targetContract]);

  return (
    <div
      className={`flex mt-[4vh] flex-col ${
        workflowStatus === 0 && "opacity-20"
      }`}
    >
      <h3 className="text-left text-2xl text-white uppercase font-black">
        Proposals{" "}
        <span className="text-sm text-gray-500 font-light capitalize">
          {trackWorkflowStatus(workflowStatus, "proposals")}{" "}
        </span>
      </h3>

      {_CHECK_STATUS_PROPOSAL_OPEN(workflowStatus) && <InputProposal />}
      {user?.voter?.isRegistered && <ListProposals />}
    </div>
  );
};
