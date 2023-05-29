import React, { useState } from "react";
import { _setProposals } from "../../utils";
import {
  doProposalsState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import Voting from "artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
import { AlertEvent } from "components/AlertEvent";
import { AlertError } from "components/AlertEvent/AlertError";

export const InputProposal = () => {
  const [inputProposal, setInputProposal] = useState();
  const dispatch = useAuthDispatch();
  const [error, setError] = useState();

  const { targetContract, proposals } = useAuthState();
  const handleSubmitProposal = () => {
    if (inputProposal?.length > 2) {
      _setProposals(inputProposal, targetContract).then(() => {
        getEvent();
        doProposalsState(dispatch, targetContract);
        setInputProposal("");
      });
    } else {
      setError(
        "addProposal. Please add at least 2 characters for your proposal."
      );
    }
  };

  const [event, setEvent] = useState(null);

  const getEvent = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, Voting.abi, signer);
      contract.on("ProposalRegistered", (proposalId) => setEvent(proposalId));
    }
  };
  return (
    <>
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
      {event && (
        <AlertEvent
          event={`${proposals?.[event]?.description} has added to proposals`}
          setEvent={setEvent}
        />
      )}
      {error && <AlertError error={error} setError={setError} />}
    </>
  );
};
