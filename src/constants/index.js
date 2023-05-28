export const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const WORKFLOW_STATUS = [
  "Registering Voters",
  "Proposals Registration Started",
  "Proposals Registration Ended",
  "Voting Session Started",
  "Voting Session Ended",
  "Votes Tallied",
];

export const _CHECK_STATUS_VOTE_OPEN = (_status) => {
  return _status >= 3;
};
export const _CHECK_STATUS_PROPOSAL_OPEN = (_status) =>
  WORKFLOW_STATUS[_status] === WORKFLOW_STATUS[1] ? true : false;
