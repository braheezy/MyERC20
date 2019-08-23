import web3 from "./web3";
import MyERC20 from "./token";
import TruffleContract from "truffle-contract";

export async function getEthAccountUtil(index) {
  let accounts;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (err) {
    console.log("****1***** " + err);
    console.log(
      "%cProbably something with MetaMask, which we depend on at this point.\nAre you running MetaMask?\nIs MetaMask pointing to the correct port?\nFor devs: did you import the Ganache seed phrase to MetaMask?",
      "font-weight: bold; font-size: large"
    );
    return 0;
  }
  return accounts[index];
}

export async function getContractUtil(abstraction, address) {
  let contract;
  if (!address) {
    try {
      contract = await abstraction.deployed();
    } catch (err) {
      console.log("****2***** " + err);
      console.log(
        "%cProbably no ethereum network available to connect to.\nAre you running Ganache?\nIs MetaMask pointing to the correct port?",
        "font-weight: bold; font-size: large"
      );
      return 0;
    }
  } else {
    try {
      contract = await abstraction.at(address);
    } catch (err) {
      console.log("****3***** " + err);
      return 0;
    }
  }
  return contract;
}

// TODO: remove. the function above does this
export async function getTokenUtil(tokenAbstraction, tokenAddress) {
  if (tokenAbstraction === 0 || tokenAddress === 0) {
    return 0;
  }
  let tokenInstance;

  try {
    tokenInstance = await tokenAbstraction.at(tokenAddress);
  } catch (err) {
    console.log("****4***** " + err);
    console.log(
      "%cFailed to get token instance with the given abstraction",
      tokenAbstraction,
      "font-weight: bold; font-size: big"
    );
    return 0;
  }

  console.log("got tokenInstance: " + tokenInstance);
  return tokenInstance;
}

export async function getTokenCountUtil(factoryInstance, userAddress) {
  let count;
  try {
    count = await factoryInstance.getCount({ from: userAddress });
  } catch (err) {
    console.log("****6***** " + err);
    return 0;
  }
  console.log("got count: " + count);
  return count;
}

export function cleanupAddress(address) {
  let result = 0;
  if (address !== undefined) {
    result =
      address.toString().substring(0, 5) + "..." + address.toString().slice(-3);
  } else return 0;
  return result;
}

export async function getBalance(tokenAddress, address) {
  let balance;
  let token = TruffleContract(MyERC20);
  token.setProvider(web3.currentProvider);

  let tokenInst = await getContractUtil(token, tokenAddress);
  try {
    balance = await tokenInst.balanceOf(address);
  } catch (err) {
    console.log("****8***** " + err);
    return 0;
  }
  console.log("got balance: " + balance);
  return balance;
}

export async function getAllowance(tokenAddress, allowerAddr, allowedAddr) {
  let allowance;
  let token = TruffleContract(MyERC20);
  token.setProvider(web3.currentProvider);

  let tokenInst = await getContractUtil(token, tokenAddress);
  try {
    allowance = await tokenInst.allowance(allowerAddr, allowedAddr);
  } catch (err) {
    console.log("****9***** ", err);
    return 0;
  }
  console.log("got allowance: ", allowance);
  return allowance;
}

export async function getTokenInfoUtil(factoryInstance, tokenAddress) {
  log("DATA_UTIL getTokenInfoUtil params", factoryInstance, tokenAddress);
  let info;
  try {
    info = await factoryInstance.getTokenInfo(tokenAddress);
  } catch (err) {
    console.log("****6***** ", err);
    return 0;
  }
  console.log("got info: ", info);
  return {
    tokenAddress: tokenAddress,
    supply: parseInt(info[0]),
    name: info[1],
    symbol: info[2],
    decimals: parseInt(info[3])
  };
}

export async function getTokenAddressUtil(factoryInstance, ethAddress, idx) {
  let tokenAddress;
  try {
    tokenAddress = await factoryInstance.tokenHolders(ethAddress, idx);
  } catch (err) {
    console.log("****10***** ", err);
    return 0;
  }
  return tokenAddress;
}
export var log = console.log.bind(console);
