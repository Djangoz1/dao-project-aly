import { BigNumber, ethers } from "ethers";
import { IcCheck, IcRefresh } from "../../assets/icones";
import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import {
  _fetchWhitelist,
  _getProposals,
  _setProposals,
  _votingProposal,
} from "../../utils";
import React, { useEffect, useState } from "react";
import { parseHex } from "../../utils/tools";
import { ListProposals } from "../../components/ListProposals";

export const Proposals = ({}) => {
  const { proposals, whitelist, user } = useAuthState();
  const dispatch = useAuthDispatch();

  const [isProposals, setIsProposals] = useState();

  useEffect(() => {
    if (proposals) {
      setIsProposals(proposals);
    }
  }, [proposals]);

  // Parse le _hex pour vérifier si le voteProposalId === index de la proposal
  const checkProposalVote = (index) => {
    const proposalId = parseHex(user?.voter?.votedProposalId?._hex);

    return proposalId === index ? true : false;
  };

  const [inputProposal, setInputProposal] = useState();
  const handleSubmitProposal = () => {
    if (inputProposal.length > 2) {
      _setProposals(inputProposal);
    }
  };
  useEffect(() => {
    doProposalsState(dispatch);
    // getProposals();
  }, []);

  const handleVoteProposal = (proposalId) => {
    _votingProposal(proposalId);
  };
  return (
    <div className="flex mt-[4vh] flex-col">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enter proposal</span>
        </label>
        <label className="input-group input-group-xs input-group-secondary">
          <button className="btn px-0" onClick={handleSubmitProposal}>
            <span className="w-full h-full text-xs">Add proposal</span>
          </button>
          <input
            type="text"
            onChange={(e) => setInputProposal(e.target.value)}
            placeholder="Description"
            className="input  input-bordered"
          />
        </label>
      </div>

      <ListProposals isProposals={isProposals} />
    </div>
  );
};
