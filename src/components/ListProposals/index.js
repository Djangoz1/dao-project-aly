import React, { useEffect, useState } from "react";
import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import { Proposal } from "./Proposal";
import { v4 as uuidv4 } from "uuid";
import { parseHex } from "../../utils/tools";
import { _CHECK_STATUS_VOTE_OPEN } from "../../constants";

export const ListProposals = ({ user }) => {
  const dispatch = useAuthDispatch();
  const [totalVote, setTotalVote] = useState(0);
  const { proposals, workflowStatus, targetContract } = useAuthState();
  const [voteIsOpen, setVoteIsOpen] = useState(false);

  useEffect(() => {
    if (workflowStatus) {
      const access = _CHECK_STATUS_VOTE_OPEN(workflowStatus);
      setVoteIsOpen(access);
    }
  }, [workflowStatus]);

  useEffect(() => {
    if (proposals) {
      let total = 0;
      proposals?.map((proposal) => {
        total += parseHex(proposal?.voteCount?._hex);
      });
      setTotalVote(total);
    }
  }, [proposals]);

  return (
    <div className="overflow-x-auto relative">
      <table className="table  w-full">
        <thead onClick={() => doProposalsState(dispatch, targetContract)}>
          <tr>
            {voteIsOpen && <th></th>}
            <th>Description</th>
            <th>
              {voteIsOpen ? "Vote count" : "Waiting for session vote open"}
            </th>
            {voteIsOpen && <th></th>}
          </tr>
        </thead>
        <tbody>
          {proposals?.map((e, i) => (
            <Proposal
              voteIsOpen={voteIsOpen}
              totalVote={totalVote}
              key={uuidv4()}
              proposal={e}
              user={user}
              index={i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
