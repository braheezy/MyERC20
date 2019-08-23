import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { Greeter, Banner, TokenSegment, TokenCreateForm } from "./comps";
import "./App.css";
import web3 from "./web3";
import ERC20Factory from "./factory.json";
import MyERC20 from "./token.json";
import TruffleContract from "truffle-contract";
import {
  getEthAccountUtil,
  getContractUtil,
  getTokenCountUtil,
  getTokenInfoUtil,
  getTokenAddressUtil,
  log
} from "./data_utils";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEthAddr: 0x0,
      factory: "",
      // true if the App is checking the user's token status
      checking: true,
      // An array of objects, each containing the info for a token
      tokenInfoArray: [
        /*
        [
          {
            address:  ,
            supply:   ,
            name:     ,
            symbol:   ,
            decimals: ,
  
          },
        ]
        */
      ],
      // so Greeter and TokenSegment know what to do
      showTokens: false
    };

    this.factoryAbstraction = TruffleContract(ERC20Factory);
    this.factoryAbstraction.setProvider(web3.currentProvider);

    this.tokenAbstraction = TruffleContract(MyERC20);
    this.tokenAbstraction.setProvider(web3.currentProvider);
  }
  async componentDidMount() {
    // if fail, they don't have an address
    let tmp_address = await getEthAccountUtil(0);
    log("APP tmp_address", tmp_address);

    // if failed, we didn't deploy factory to active chain (if it's even active)
    let tmp_factory = await getContractUtil(this.factoryAbstraction);
    log("APP tmp_factory", tmp_factory);

    // if failed, something went wrong above...probably
    let tmp_count = await getTokenCountUtil(tmp_factory, tmp_address);
    log("APP tmp_count", tmp_count);

    // given tmp_count, how many tokens the user, tmp_address, has
    // obtain all token information for children to consume
    let tokenInfos = await this.getAllTokenInfo(
      tmp_count,
      tmp_address,
      tmp_factory
    );
    log("APP tokenInfos", tokenInfos);

    let showTokens = false;
    if (Number(tmp_count) > 0) showTokens = true;

    this.setState({
      userEthAddr: tmp_address,
      factory: tmp_factory,
      tokenInfoArray: [...this.state.tokenInfoArray, ...tokenInfos],
      checking: false,
      showTokens: showTokens
    });

    log("APP componentDidMount end state", this.state);
  }

  getAllTokenInfo = async (tokenCount, userEthAddress, factory) => {
    let result = [];
    for (let tokenIdx = 0; tokenIdx < tokenCount; tokenIdx++) {
      // get token address
      let tokenAddress = await getTokenAddressUtil(
        factory,
        userEthAddress,
        tokenIdx
      );
      // get token info
      let tokenInfo = await getTokenInfoUtil(factory, tokenAddress);
      log("APP tokenInfo", tokenInfo);

      result.push(tokenInfo);
    }
    return result;
  };

  // So create Form can update app with new token
  addToken = async () => {
    let tokenAddress = await getTokenAddressUtil(
      this.state.factory,
      this.state.userEthAddr,
      this.state.tokenInfoArray.length
    );
    let tokenInfo = await getTokenInfoUtil(this.state.factory, tokenAddress);
    log("APP addToken tokenInfo", tokenInfo);
    this.setState(previousState => ({
      tokenInfoArray: [...previousState.tokenInfoArray, tokenInfo],
      showTokens: true
    }));
  };

  hideTokenGreeter = () => {
    log("APP hideTokenGreeter");
    this.setState({ showTokens: false });
  };

  render() {
    log("APP render state", this.state);
    return (
      <Grid columns="equal" centered>
        <Grid.Row>
          <Banner />
        </Grid.Row>

        <Grid.Row>
          <TokenCreateForm
            factory={this.state.factory}
            userEthAddress={this.state.userEthAddr}
            addToken={this.addToken}
          />
        </Grid.Row>
        <Grid.Row>
          <Greeter
            userEthAddress={this.state.userEthAddr}
            showTokens={this.state.showTokens}
          />
        </Grid.Row>

        <Grid.Row>
          <TokenSegment
            showTokens={this.state.showTokens}
            factory={this.state.factory}
            userEthAddress={this.state.userEthAddr}
            hideTokenGreeter={this.hideTokenGreeter}
            checking={this.state.checking}
            tokenInfoArray={this.state.tokenInfoArray}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
