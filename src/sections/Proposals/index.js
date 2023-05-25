import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";

import { ListProposals } from "../../components/ListProposals";
import { InputProposal } from "../../components/ListProposals/InputProposal";
import { _CHECK_STATUS_PROPOSAL_OPEN } from "../../constants";

export const Proposals = () => {
  const { workflowStatus, targetContract, user } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (targetContract) {
      doProposalsState(dispatch, targetContract);
    }
  }, [targetContract]);

  return (
    <div className="flex mt-[4vh] flex-col ">
      {_CHECK_STATUS_PROPOSAL_OPEN(workflowStatus) ? (
        <InputProposal />
      ) : (
        <p className="my-5 font-black text-white">
          Registration proposal is closed
        </p>
      )}
      {user?.voter?.isRegistered && <ListProposals />}
    </div>
  );
};
