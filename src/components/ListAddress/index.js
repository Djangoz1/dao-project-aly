import { IcCheck, IcCross, IcRefresh } from "../../assets/icones";
import {
  doVotersState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";

export const ListAddress = () => {
  const { whitelist, voters } = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    if (whitelist && !voters) {
      doVotersState(dispatch, whitelist);
    }
  }, [whitelist]);

  return (
    <div className="overflow-x-auto relative">
      <table className="table  w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Address</th>
            <th>Vote proposal</th>
            <th>Has voted</th>
          </tr>
        </thead>
        <tbody>
          {whitelist?.map((e, i) => (
            <ElementList key={e} address={e} voter={voters?.[i]} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ElementList = ({ address, voter }) => {
  const proposalVote =
    voter?.votedProposalId?._hex?.[voter?.votedProposalId?._hex?.length - 1];
  const { proposals } = useAuthState();
  const myVote = proposals?.[proposalVote];

  return (
    <tr className="text-xs">
      <th className="text-xs">{address}</th>
      <td>{voter?.hasVoted ? myVote?.description : "No vote"}</td>
      <td>{voter?.hasVoted ? <IcCheck /> : <IcCross />}</td>
    </tr>
  );
};
