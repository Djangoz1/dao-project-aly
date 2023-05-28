import { ethers } from "ethers";

export const parseHex = (_hex) => ethers.BigNumber.from(_hex).toNumber();

export const isUser = (_firstAddress, _secondAddress) => {
  if (`${_firstAddress}`.toLowerCase() === `${_secondAddress}`.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};

export const trackWorkflowStatus = (_statusId, type) => {
  if (_statusId === 0 && type === "proposals") {
    return "Waiting open session register ...";
  } else if (_statusId === 1 && type === "proposals") {
    return "Register proposals";
  } else if (_statusId === 2 && type === "proposals") {
    return "Waiting open vote session ...";
  } else if (_statusId === 3 && type === "proposals") {
    return "Vote session ...";
  } else if (_statusId === 4 && type === "proposals") {
    return "Waiting result ...";
  } else if (_statusId === 0 && type === "voters") {
    return "Register whitelist";
  } else if (_statusId > 0 && type === "voters") {
    return "Waiting result ...";
  }
};
