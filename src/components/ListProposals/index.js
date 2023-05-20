import React, { useEffect, useState } from "react";
import { doProposalsState, useAuthDispatch } from "../../context/auth";

import { Proposal } from "./Proposal";
import { v4 as uuidv4 } from "uuid";
import { parseHex } from "../../utils/tools";

export const ListProposals = ({ isProposals }) => {
  const dispatch = useAuthDispatch();
  const [totalVote, setTotalVote] = useState(0);
  useEffect(() => {
    if (isProposals) {
      let total = 0;
      isProposals?.map((proposal) => {
        total += parseHex(proposal?.voteCount?._hex);
      });
      setTotalVote(total);
    }
  }, [isProposals]);

  return (
    <div className="overflow-x-auto relative">
      <table className="table  w-full">
        {/* head */}
        <thead onClick={() => doProposalsState(dispatch)}>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Count vote</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isProposals?.map((e, i) => (
            <Proposal
              totalVote={totalVote}
              key={uuidv4()}
              proposal={e}
              index={i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
