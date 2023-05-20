import { ethers } from "ethers";

export const parseHex = (_hex) => ethers.BigNumber.from(_hex).toNumber();
