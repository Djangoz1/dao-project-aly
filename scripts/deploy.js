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
