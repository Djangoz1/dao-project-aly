import {
  doVotersState,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";

import React, { useEffect } from "react";
import { Voter } from "./Voter";

export const ListVoters = ({ user }) => {
  const { whitelist, voters } = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    if (whitelist && !voters) {
      doVotersState(dispatch, whitelist);
    }
  }, [whitelist]);

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
