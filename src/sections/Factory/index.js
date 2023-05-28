import React, { useEffect, useState } from "react";
import {
  doTargetContract,
  doVotingFactory,
  useAuthDispatch,
  useAuthState,
} from "../../context/auth";
import {
  _fetchOwner,
  _getWorkflowStatus,
  _setContractFactory,
} from "../../utils";
import { WORKFLOW_STATUS } from "../../constants";

export const Factory = () => {
  const { factory } = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <div className="w-2/5 bg-gray-950 h-full relative  ">
      <div className="bg-zinc-800 w-full p-2 text-white">
        Voting pool contracts
      </div>
      <div className={`flex flex-col h-full box-border p-4  overflow-y-scroll`}>
        {factory?.length > 0 ? (
          factory?.map((e) => <ElementFactory key={e} contract={e} />)
        ) : (
          <p className="text-2xl text-white absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2  m-auto">
            Please add a vote
          </p>
        )}
        <button
          onClick={() =>
            _setContractFactory().then((e) => doVotingFactory(dispatch))
          }
          className="btn btn-sm btn-primary w-1/2 mx-auto mt-4"
        >
          Add vote
        </button>
      </div>
    </div>
  );
};

const ElementFactory = ({ contract }) => {
  const { targetContract } = useAuthState();
  const dispatch = useAuthDispatch();
  const [status, setStatus] = useState();
  const [owner, setOwner] = useState();
  const handleSelectContract = (contract) => {
    doTargetContract(dispatch, contract);
  };

  const getStatus = async () => {
    const result = await _getWorkflowStatus(contract);
    setStatus(result);
  };
  const getOwner = async () => {
    const result = await _fetchOwner(contract);
    setOwner(result);
  };

  useEffect(() => {
    if (!status) {
      getStatus();
    }
    if (!owner) {
      getOwner();
    }
  }, [contract]);

  return (
    <div
      className={`flex flex-col justify-between border mb-2 border-gray-700 text-left text-sm rounded p-4 ${
        targetContract === contract
          ? "bg-gray-900 text-blue-600"
          : "bg-gray-700"
      }`}
      key={contract}
      onClick={() => handleSelectContract(contract)}
    >
      <div className="flex flex-col">
        <p className="text-gray-400 underline">Contract voting</p>
        {contract}
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400 underline">Status vote</p>
        {WORKFLOW_STATUS?.[status]}
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400 underline">Admin vote</p>
        {owner}
      </div>
    </div>
  );
};
