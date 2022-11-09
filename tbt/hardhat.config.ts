// import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-gas-reporter";
import "solidity-coverage"
import '@typechain/hardhat'
// import "tsconfig-paths/register"

const config: HardhatUserConfig = {
  solidity: "0.8.0",
};

export default config;
