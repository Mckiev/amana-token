import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv';
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: "https://polygon.llamarpc.com",
      accounts: {
        mnemonic: process.env.TEST_MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 1,
        passphrase: "",
      },
    }
  },
  etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
