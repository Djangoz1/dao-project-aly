import { _fetchWhitelist } from "../../utils";
import React, { useEffect, useState } from "react";

export const ListAddress = () => {
  const [whitelist, setWhitelist] = useState();
  const getWhitelist = async () => {
    const result = await _fetchWhitelist();
    setWhitelist(result);
  };
  useEffect(() => {
    getWhitelist();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead onClick={getWhitelist}>
          <tr>
            <th>Address</th>
            <th>Has voted</th>
            <th>Vote proposal</th>
            <th>Register Date</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
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
