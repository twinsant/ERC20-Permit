import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'

const config: HardhatUserConfig = {
  solidity: "0.8.0",
};

export default config;
