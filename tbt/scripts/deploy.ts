import { ethers } from "hardhat";

async function main() {
  const initialSupply = 230000000; // Twitter users

  const TrumpBackTwitter = await hre.ethers.getContractFactory("TrumpBackTwitter");
  const trumpBackTwitter = await TrumpBackTwitter.deploy(initialSupply);

  await trumpBackTwitter.deployed();

  console.log(`TrumpBackTwitter ${initialSupply} deployed to ${trumpBackTwitter.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
