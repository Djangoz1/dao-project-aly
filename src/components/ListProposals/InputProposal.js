import React, { useState } from "react";
import { _setProposals } from "../../utils";
import { doProposalsState, useAuthDispatch } from "../../context/auth";

export const InputProposal = () => {
  const [inputProposal, setInputProposal] = useState();
  const dispatch = useAuthDispatch();
  const handleSubmitProposal = () => {
    if (inputProposal.length > 2) {
      _setProposals(inputProposal).then(() => {
        doProposalsState(dispatch);
        setInputProposal("");
      });
    }
  };
  return (
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
          value={inputProposal}
          onChange={(e) => setInputProposal(e.target.value)}
          placeholder="Description"
          className="input  input-bordered"
        />
      </label>
    </div>
  );
};
