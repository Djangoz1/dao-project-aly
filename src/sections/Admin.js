import { _fetchWhitelist, _setWhitelist } from "../utils";
import { ListAddress } from "../components/ListAddress";
import React, { useEffect, useState } from "react";
import { IcRefresh } from "../assets/icones";
import { EtapButton } from "../components/EtapButtons";
// 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
// 0x90f79bf6eb2c4f870365e785982e1f101e93b906
// 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65
// 0xa0ee7a142d267c1f36714e4a8f75612f20a79720
// 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f
// 0xbcd4042de499d14e55001ccbb24a551f3b954096
// 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199
export const Admin = ({ isContract }) => {
  const [inputAddress, setInputAddress] = useState();
  const [whitelist, setWhitelist] = useState();
  const getWhitelist = async () => {
    const result = await _fetchWhitelist();
    if (!result.err) {
      setWhitelist(result);
    }
  };
  useEffect(() => {
    if (!whitelist) {
      getWhitelist();
    }
  }, []);

  const handleSubmitAddress = () => {
    _setWhitelist(inputAddress);
    getWhitelist();
  };

  return (
    <div className=" flex flex-col">
      <h2>Admin Section</h2>
      <EtapButton />
      <div className="flex items-end justify-between">
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
        <button className="btn" onClick={getWhitelist}>
          <IcRefresh />
        </button>
      </div>
      <ListAddress whitelist={whitelist} />
    </div>
  );
};
