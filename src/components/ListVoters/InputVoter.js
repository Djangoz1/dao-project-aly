import React, { useState } from "react";
import { _getEvent, _setWhitelist } from "../../utils";

import {
  doWhitelistState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import { ethers } from "ethers";
import Voting from "artifacts/contracts/Voting.sol/Voting.json";
import { AlertEvent } from "components/AlertEvent";
import { AlertError } from "components/AlertEvent/AlertError";

export const InputVoter = () => {
  const { targetContract, user, whitelist } = useAuthState();
  const [inputAddress, setInputAddress] = useState();
  const [event, setEvent] = useState();
  const dispatch = useAuthDispatch();
  const [error, setError] = useState();
  const handleSubmitAddress = async () => {
    if (inputAddress?.length > 8 && user.owner) {
      const result = await _setWhitelist(inputAddress, targetContract);
      if (result?.message) {
        setError(
          "addWhitlistedAddress. Please be assure you're connected with owner"
        );
      } else {
        getEvent();
        doWhitelistState(dispatch, targetContract);
      }
    } else {
      setError("addWhitlistedAddress. Please input a valid address");
    }
  };
  const getEvent = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, Voting.abi, signer);
      contract.on("VoterRegistered", (e) => setEvent(e));
    }
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Enter address</span>
      </label>
      <label className="input-group input-group-xs input-group-secondary">
        <button className="btn px-0 ">
          <span className="w-full h-full text-xs" onClick={handleSubmitAddress}>
            Add ETH adress
          </span>
        </button>
        <input
          type="text"
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="0x234df2..."
          className="input  input-bordered"
        />
      </label>
      {event && (
        <AlertEvent
          event={`Voter ${event} has been added to contract`}
          setEvent={setEvent}
        />
      )}
      {error && <AlertError error={error} setError={setError} />}
    </div>
  );
};
