export const CONTRACT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

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
