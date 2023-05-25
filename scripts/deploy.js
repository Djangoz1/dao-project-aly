const hre = require("hardhat");

async function main() {
  const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
  const votingFactory = await VotingFactory.deploy();

  await votingFactory.deployed();

  console.log("Voting deployed to:", votingFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// const hre = require("hardhat");

// async function main() {

//   const Voting = await hre.ethers.getContractFactory("Voting");
//   const voting = await Voting.deploy();

//   await voting.deployed();

//   console.log("Voting deployed to:", voting.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
