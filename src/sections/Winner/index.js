import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { _getWinner } from "utils";

export const Winner = () => {
  const { targetContract } = useAuthState();
  const [winner, setWinner] = useState();
  useEffect(() => {
    _getWinner(targetContract).then((_winner) =>
      setWinner(_winner?.description)
    );
  }, []);

  return (
    <div className="flex items-end flex-col">
      <h3 className="text-left text-2xl text-white uppercase font-black">
        Winner
      </h3>
      <span className="text-sm text-blue-500  capitalize">{winner}</span>
    </div>
  );
};
