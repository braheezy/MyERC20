export async function getEthAccountUtil(index, web3) {
  if (web3.currentProvider.selectedAddress) {
    return web3.currentProvider.selectedAddress;
  }

  let accounts;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (err) {
    console.log("****1***** " + err);
    console.log(
      "%cProbably something with MetaMask, which we depend on at this point.\nAre you running MetaMask?\nIs MetaMask pointing to the correct port?\nFor devs: did you import the Ganache seed phrase to MetaMask?",
      "font-weight: bold; font-size: big"
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
        "font-weight: bold; font-size: big"
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

export async function getTokenCountUtil(factoryInstance, userAddress) {
  let count = 0;
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

// tokenInst: the particular token to check
// address: the address of the owner of tokens whose balance you want
export async function getBalance(tokenInst, address) {
  let balance;

  //console.log("tokenInst", tokenInst);
  try {
    balance = await tokenInst.balanceOf(address);
  } catch (err) {
    console.log("****8***** " + err);
    return 0;
  }
  //console.log("got balance: " + balance);
  return balance;
}

export async function getAllowance(tokenInst, allowerAddr, allowedAddr) {
  let allowance;

  try {
    allowance = await tokenInst.allowance(allowerAddr, allowedAddr);
  } catch (err) {
    console.log("****9***** ", err);
    return 0;
  }
  //log("got allowance: ", allowance);
  return allowance;
}

export async function getTokenInfoUtil(factoryInstance, tokenAddress) {
  //log("DATA_UTIL getTokenInfoUtil params", factoryInstance, tokenAddress);
  let info;
  try {
    info = await factoryInstance.getTokenInfo(tokenAddress);
  } catch (err) {
    console.log("****11***** ", err);
    return 0;
  }
  //log("got info: ", info);
  return {
    tokenAddress: tokenAddress,
    supply: parseInt(info[0]),
    name: info[1],
    symbol: info[2],
    decimals: parseInt(info[3])
  };
}

export async function getTokenAddressUtil(factoryInstance, ethAddress, idx) {
  //log("DATA_UTIL getTokenAddressUtil params", factoryInstance, ethAddress, idx);
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
