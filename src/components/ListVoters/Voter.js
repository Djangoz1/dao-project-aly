import React, { useEffect, useState } from "react";
import { useAuthState } from "../../context/auth";
import { IcCheck, IcCross } from "../../assets/icones";
import { isUser } from "../../utils/tools";
import { _CHECK_STATUS_VOTE_OPEN } from "../../constants";
import { _getVoter } from "../../utils";

export const Voter = ({ address, user }) => {
  const [voter, setVoter] = useState({});

  const { whitelist, targetContract } = useAuthState();
  const proposalVote =
    voter?.votedProposalId?._hex?.[voter?.votedProposalId?._hex?.length - 1];
  const { proposals, workflowStatus } = useAuthState();

  const voterChoice = proposals?.[proposalVote];

  useEffect(() => {
    if (targetContract) {
      const result = _getVoter(address, targetContract);
      setVoter(result);
    }
  }, [whitelist, targetContract]);
  return (
    <tr className="text-xs relative">
      <th
        className={`text-xs ${
          isUser(user?.address, address) && "text-blue-600"
        }`}
      >
        {address}
      </th>
      <td
        className={`text-xs ${isUser(user?.address, address) && "text-white"}`}
      >
        {!_CHECK_STATUS_VOTE_OPEN(workflowStatus) ? (
          "Waiting for session vote open"
        ) : voter?.hasVoted ? (
          voterChoice?.description
        ) : (
          <IcCross />
        )}
      </td>

      <div className="absolute -right-1 -top-3">
        {voter?.hasVoted ? <IcCheck /> : null}
      </div>
    </tr>
  );
};
