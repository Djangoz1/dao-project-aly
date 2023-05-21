export const CONTRACT_ADDRESS = "0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6";

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
