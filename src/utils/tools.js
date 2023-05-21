import { ethers } from "ethers";

export const parseHex = (_hex) => ethers.BigNumber.from(_hex).toNumber();

export const isUser = (_firstAddress, _secondAddress) => {
  if (`${_firstAddress}`.toLowerCase() === `${_secondAddress}`.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
