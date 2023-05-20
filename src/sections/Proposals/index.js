import { IcRefresh } from "../../assets/icones";
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

export const Proposals = ({}) => {
  const { proposals } = useAuthState();
  const dispatch = useAuthDispatch();

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

      <div className="overflow-x-auto relative">
        <table className="table  w-full">
          {/* head */}
          <thead onClick={() => doProposalsState(dispatch)}>
            <tr>
              <th>Address proposer</th>
              <th>Description</th>
              <th>Count vote</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {proposals?.map((e, i) => (
              <tr className="text-xs" key={e?.description}>
                <th className="text-xs">{e?.description}</th>
                <td>Undefined</td>
                <td>{e?.voteCount?._hex}</td>

                <th className="flex justify-end">
                  <button className="btn" onClick={() => handleVoteProposal(i)}>
                    Click for vote
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
