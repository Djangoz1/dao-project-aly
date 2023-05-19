// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Voting is Ownable {
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    modifier voteOpen() {
        require(10 == 50, "Vote period is claused");
        _;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    mapping(address => Voter) voters;
    Proposal[] proposals;
    Proposal public winner;

    constructor(address[] memory _whitelist) {
        //  WorkflowStatus.RegisteringVoters;
        for (uint _index = 0; _index < _whitelist.length; _index++) {
            voters[_whitelist[_index]] = Voter(true, false, 0);
        }
    }

    modifier voterAccess() {
        require(voters[msg.sender].isRegistered, "You're not registred");
        _;
    }

    function addProposal(string memory _description) public voterAccess {
        proposals.push(Proposal(_description, 0));
    }

    //function closeVotingSession() public onlyOwner {
    // require(WorkflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session is not oppen");
    //  WorkflowStatus.VotingSessionEnded;
    //}
    //function openVotingSession() public onlyOwner {
    // require(WorkflowStatus == WorkflowStatus.VotingSessionEnd, "Voting session is already open");
    //   WorkflowStatus.VotingSessionStarted;
    // }

    function voteProposal(uint _id) public voterAccess {
        proposals[_id].voteCount++;
    }

    function countVote() public onlyOwner returns (Proposal memory) {
        // require(WorkflowStatus == WorkflowStatus.VotingSessionEnd, "Voting session is not closed");

        uint totalVotes;
        for (uint _id; _id < proposals.length; _id++) {
            totalVotes += proposals[_id].voteCount;
        }

        for (uint _id; _id < proposals.length; _id++) {
            if (winner.voteCount < proposals[_id].voteCount) {
                winner = proposals[_id];
            }
        }
        WorkflowStatus VotesTallied;
        return winner;
    }
}
