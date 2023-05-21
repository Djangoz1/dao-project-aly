import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";

import { ListProposals } from "../../components/ListProposals";
import { InputProposal } from "../../components/ListProposals/InputProposal";
import { _CHECK_STATUS_PROPOSAL_OPEN } from "../../constants";

export const Proposals = ({ user }) => {
  const { workflowStatus } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    doProposalsState(dispatch);
  }, [user]);

  return (
    <div className="flex mt-[4vh] flex-col">
      {_CHECK_STATUS_PROPOSAL_OPEN(workflowStatus) && <InputProposal />}
      {user?.voter?.isRegistered && <ListProposals user={user} />}
    </div>
  );
};
