import { IcRefresh } from "../../assets/icones";
import { _fetchWhitelist } from "../../utils";
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
            <tr className="text-xs" key={e}>
              <th className="text-xs">{e}</th>
              <td>FALSE</td>
              <td>Undefined</td>
              <td>Blue</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
