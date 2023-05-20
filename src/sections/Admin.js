import { _setWhitelist } from "../utils";
import { ListAddress } from "../components/ListAddress";
import React, { useState } from "react";
// 0xa0ee7a142d267c1f36714e4a8f75612f20a79720
// 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f
// 0xbcd4042de499d14e55001ccbb24a551f3b954096
export const Admin = ({ isContract }) => {
  const [inputAddress, setInputAddress] = useState();
  console.log(isContract);

  return (
    <div className=" flex flex-col">
      <h2>Admin Section</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enter address</span>
        </label>
        <label className="input-group input-group-xs input-group-secondary">
          <button
            className="btn px-0"
            onClick={() => _setWhitelist(inputAddress)}
          >
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
      <ListAddress />
    </div>
  );
};
