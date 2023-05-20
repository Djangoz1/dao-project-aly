import React from "react";
import { parseHex } from "../../utils/tools";
import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { IcCheck } from "../../assets/icones";
import { _votingProposal } from "../../utils";

export const Proposal = ({ proposal, index, totalVote }) => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const checkProposalVote = (index) => {
    const proposalId = parseHex(user?.voter?.votedProposalId?._hex);

    return proposalId === index ? true : false;
  };
  const handleVoteProposal = async (proposalId) => {
    await _votingProposal(proposalId);
    doProposalsState(dispatch);
  };

  const findAverageVote = () => {
    return Math.floor((parseHex(proposal?.voteCount?._hex) / totalVote) * 100);
  };

  return (
    <tr className="text-xs " key={proposal?.description}>
      <th>
        <div
          className="radial-progress  text-primary-content border-4 border-primary"
          style={{ "--value": findAverageVote(), "--size": "3rem" }}
        >
          {findAverageVote()}%
        </div>
      </th>
      <th className="text-xs">{proposal?.description}</th>

      <td>{parseHex(proposal?.voteCount?._hex)}</td>

      <th className=" w-fit">
        {user?.voter?.hasVoted ? (
          checkProposalVote(index) && (
            <div className="flex justify-end">
              <IcCheck />
            </div>
          )
        ) : (
          <button className="btn" onClick={() => handleVoteProposal(index)}>
            Click for vote
          </button>
        )}
      </th>
    </tr>
  );
};
