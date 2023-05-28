import { useAuthState } from "../../context/auth";
import { IcCheck, IcCross } from "../../assets/icones";
import { isUser } from "../../utils/tools";
import { _CHECK_STATUS_VOTE_OPEN } from "../../constants";

export const Voter = ({ address, user, voter }) => {
  const proposalVote =
    voter?.votedProposalId?._hex?.[voter?.votedProposalId?._hex?.length - 1];
  const { proposals, workflowStatus } = useAuthState();

  const voterChoice = proposals?.[proposalVote];

  return (
    <tr className="text-xs relative">
      <th
        className={`text-xs ${
          isUser(user?.address, address) && "text-blue-600"
        }`}
      >
        {address}
      </th>
      <td
        className={`text-xs ${isUser(user?.address, address) && "text-white"}`}
      >
        {!_CHECK_STATUS_VOTE_OPEN(workflowStatus) ? (
          "Waiting for session vote open"
        ) : voter?.hasVoted ? (
          voterChoice?.description
        ) : (
          <IcCross />
        )}
      </td>

      {voter?.hasVoted ? (
        <div className="absolute -right-1 -top-3">
          {voter?.address}
          <IcCheck />
        </div>
      ) : null}
    </tr>
  );
};
