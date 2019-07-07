import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
  web3 = window.web3;
  // In browswer and running metamask
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(
    // get provider from infura
    new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/0144fd7a7423401caa4b4479b5e26ba2"
    )
  );
}

export default web3;
