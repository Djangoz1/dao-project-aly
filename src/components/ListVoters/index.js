import {
  doVotersState,
  doWhitelistState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";
import { Voter } from "./Voter";

export const ListVoters = ({ user }) => {
  const { whitelist, voters, targetContract } = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    if (targetContract) {
      // doWhitelistState(dispatch, targetContract).then((e) =>
      //   // doVotersState(dispatch, whitelist, targetContract)
      // );
      doWhitelistState(dispatch, targetContract);
    }
  }, [targetContract]);

  return (
    <div className="overflow-x-visible relative">
      <table className="table  w-full">
        <thead>
          <tr>
            <th>Address</th>
            <th>Vote proposal</th>
          </tr>
        </thead>
        <tbody>
          {whitelist?.map((e, i) => (
            <Voter key={e} address={e} user={user} voter={voters?.[i]} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
