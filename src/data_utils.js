import web3 from "./web3";

export async function getEthAccountUtil(index) {
  let accounts;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (err) {
    console.log("****1** " + err);
    console.log(
      "%cProbably something with MetaMask, which we depend on at this point.\nAre you running MetaMask?\nIs MetaMask pointing to the correct port?\nFor devs: did you import the Ganache seed phrase to MetaMask?",
      "font-weight: bold; font-size: large"
    );
  }
  console.log("got eth accounts: " + accounts);
  return accounts[index];
}

export async function getContractUtil(abstraction, address) {
  let contract;
  if (!address) {
    try {
      contract = await abstraction.deployed();
    } catch (err) {
      console.log("****2*** " + err);
      console.log(
        "%cProbably no ethereum network available to connect to.\nAre you running Ganache?\nIs MetaMask pointing to the correct port?",
        "font-weight: bold; font-size: large"
      );
    }
  } else {
    try {
      contract = await abstraction.at(address);
    } catch (err) {
      console.log("****5*** " + err);
    }
  }
  console.log("got contract: " + contract);
  return contract;
}

export async function getTokenCountUtil(factoryInstance, userAddress) {
  let count;
  try {
    count = await factoryInstance.tokenCount(userAddress);
  } catch (err) {
    console.log("****3*** " + err);
  }
  console.log("got count: " + count);
  return count;
}

export function cleanupAddress(address) {
  let result = 0;
  if (address !== undefined) {
    result =
      address.toString().substring(0, 5) + "..." + address.toString().slice(-5);
  }
  return result;
}

export async function updateCountUtil(factoryInstance, newCount, userAddress) {
  console.log("updateCountUtil params", [factoryInstance, newCount]);
  let t;
  try {
    t = await factoryInstance.updateCount(newCount, { from: userAddress });
  } catch (err) {
    console.log("****6*** " + err);
  }
  console.log("updateCountUtil success", t);
}
