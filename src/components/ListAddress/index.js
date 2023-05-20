import { IcCheck, IcCross, IcRefresh } from "../../assets/icones";
import { _fetchWhitelist, _getVoter } from "../../utils";
import React, { useEffect, useState } from "react";

export const ListAddress = ({ whitelist }) => {
  return (
    <div className="overflow-x-auto relative">
      <table className="table  w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Address</th>
            <th>Has voted</th>
            <th>Vote proposal</th>
            <th>Register Date</th>
          </tr>
        </thead>
        <tbody>
          {whitelist?.map((e) => (
            <ElementList address={e} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ElementList = ({ address }) => {
  const [voterState, setVoterState] = useState({});
  const getVoter = async () => {
    const voter = await _getVoter(address);
    console.log("voter ---------", voter);
    setVoterState(voter);
  };
  useEffect(() => {
    getVoter(address);
  }, [address]);
  return (
    <tr className="text-xs" key={address}>
      <th className="text-xs">{address}</th>
      <td>{voterState?.hasVoted ? <IcCheck /> : <IcCross />}</td>
      <td>{voterState?.votedProposalId?._hex}</td>
      <td>Blue</td>
    </tr>
  );
};
