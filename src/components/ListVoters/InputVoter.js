import React, { useState } from "react";
import { _setWhitelist } from "../../utils";
import { doWhitelistState, useAuthDispatch } from "../../context/auth";

export const InputVoter = () => {
  const [inputAddress, setInputAddress] = useState();
  const dispatch = useAuthDispatch();
  const handleSubmitAddress = async () => {
    await _setWhitelist(inputAddress);
    doWhitelistState(dispatch);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Enter address</span>
      </label>
      <label className="input-group input-group-xs input-group-secondary">
        <button className="btn px-0" onClick={handleSubmitAddress}>
          <span className="w-full h-full text-xs">Add ETH adress</span>
        </button>
        <input
          type="text"
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="0x234df2..."
          className="input  input-bordered"
        />
      </label>
    </div>
  );
};
