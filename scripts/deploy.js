const hre = require("hardhat");
// const { MerkleTree } = require("merkletreejs");
// const keccak256 = require("keccak256");
// const tokens = require("./tokens.json");

async function main() {
  const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
  const votingFactory = await VotingFactory.deploy();

  await votingFactory.deployed();

  // ! ARBRE DE MERKLE
  // // ! Merkle tree for votingContract
  // let tab = [];
  // tokens.map((token) => {
  //   tab.push(token.address);
  // });
  // // ? Ensuite il faut que je convertisse chaquue address en une address hashé

  // const leaves = tab.map((address) => keccak256(address));
  // const tree = new MerkleTree(leaves, keccak256, { sort: true });
  // const root = tree.getHexRoot();
  // console.log("root", root);
  // // !

  console.log("Voting deployed to:", votingFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
