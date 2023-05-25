import React, { useEffect, useState } from "react";
import { parseHex } from "../../utils/tools";
import {
  doProposalsState,
  doUserState,
  doVotersState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { IcCheck } from "../../assets/icones";
import { _votingProposal } from "../../utils";

export const Proposal = ({ proposal, index, user, totalVote, voteIsOpen }) => {
  const dispatch = useAuthDispatch();

  const { whitelist, owner, targetContract } = useAuthState();
  const checkProposalVote = (index) => {
    const proposalId = parseHex(user?.voter?.votedProposalId?._hex);
    return proposalId === index ? true : false;
  };
  const handleVoteProposal = async (proposalId) => {
    await _votingProposal(proposalId, targetContract);
    await doProposalsState(dispatch, targetContract);
    await doUserState(dispatch, owner, targetContract);
    await doVotersState(dispatch, whitelist, targetContract);
  };

  const findAverageVote = () => {
    const _int = (parseHex(proposal?.voteCount?._hex) / totalVote) * 100;

    return _int > 0 ? Math.floor(_int) : 0;
  };

  return (
    <tr className="text-xs " key={proposal?.description}>
      {voteIsOpen && (
        <td>
          <div
            className="radial-progress  text-primary-content border-4 border-primary"
            style={{ "--value": findAverageVote(), "--size": "3rem" }}
          >
            {findAverageVote()}%
          </div>
        </td>
      )}
      <th className="text-xs">{proposal?.description}</th>
      {voteIsOpen && <td>{parseHex(proposal?.voteCount?._hex)}</td>}
      <th className=" w-fit">
        <div className="flex justify-end">
          {user?.voter?.hasVoted ? (
            checkProposalVote(index) && <IcCheck />
          ) : voteIsOpen ? (
            <button
              className="btn glass btn-sm"
              onClick={() => handleVoteProposal(index)}
            >
              Vote
            </button>
          ) : (
            <button className="btn btn-sm btn-square loading"></button>
          )}
        </div>
      </th>
    </tr>
  );
};
