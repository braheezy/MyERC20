import React, { Component } from "react";
import { Grid, Button, Menu } from "semantic-ui-react";
import {
  Greeter,
  TokenSegment,
  TokenCreateForm,
  ErrorMessage,
  RetrieveTokenForm
} from "./comps";
import "./App.css";
import getWeb3 from "./web3";
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
import { ERROR } from "./errorCodes";

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
            address:
            name:
            supply: 
            symbol: 
            decimals:
            render:   
          },
        ]
        */
      ],
      // so Greeter and TokenSegment know what to do
      showTokens: false,
      // Are we connected to web3, metamask, and factory?
      connected: false,
      // should we show a convient message that they need to accept
      // connection or turn off privacy mode to continue
      showErrorMessage: false,
      messageCode: ""
    };

    this.factoryAbstraction = TruffleContract(ERC20Factory);
    this.tokenAbstraction = TruffleContract(MyERC20);
  }
  async componentDidMount() {
    let web3 = await getWeb3();
    log("APP componentDidMount web3", web3);

    await this.setupEthereumEnv(web3);
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

      result.push(this.parseTokenInfo(tokenInfo));
    }
    return result;
  };

  // parse info object and stuff with data App needs
  parseTokenInfo(token) {
    let result = {
      address: token.tokenAddress,
      name: token.name,
      supply: token.supply.toString(),
      symbol: token.symbol,
      decimals: token.decimals.toString(),
      render: true
    };
    //log("APP parseTokenInfo result", result);
    return result;
  }

  // So create Form can update app with new token
  addToken = async () => {
    // length of array will be newest token added
    // for first token, length is 0 and this works out b/c 0-indexed arrays
    let tokenAddress = await getTokenAddressUtil(
      this.state.factory,
      this.state.userEthAddr,
      this.state.tokenInfoArray.length
    );
    let tokenInfo = await getTokenInfoUtil(this.state.factory, tokenAddress);
    //log("APP addToken tokenInfo", tokenInfo);
    this.setState(previousState => ({
      tokenInfoArray: [
        ...previousState.tokenInfoArray,
        this.parseTokenInfo(tokenInfo)
      ],
      showTokens: true
    }));
  };

  // either delete or retreive a token at the given address
  // action will be either "delete" or "retrieve"
  // TODO: handle retrieving an ERC20 token not made on this App
  updateTokenRender = (address, action) => {
    let copy;

    // make copy of React state because it should be immutable
    copy = [...this.state.tokenInfoArray];

    // find the token and update render flag accordingly
    let foundToken = copy.find(token => token.address === address);
    if (foundToken) {
      if (action === "delete") {
        foundToken.render = false;
      } else {
        foundToken.render = true;
      }
    }
    // no token found. do nothing
    else {
      return 0;
    }

    // if all token render flags are false, update greeter
    let renderCount = copy.every(token => token.render === false);
    //log("APP renderCount", renderCount);
    if (renderCount === true) {
      this.hideTokenGreeter();
    }
    this.setState({ tokens: copy });
  };

  hideTokenGreeter = () => {
    this.setState({ showTokens: false });
  };

  setupEthereumEnv = async web3 => {
    switch (web3) {
      case ERROR.UNKNOWN:
        // user needs to click connect button and enable metamask
        this.setState({
          checking: false,
          showErrorMessage: false,
          messageCode: ERROR.UNKNOWN
        });
        break;
      case ERROR.METAMASK_NO_LOGIN:
        // not logged in
        this.setState({
          checking: false,
          showErrorMessage: true,
          messageCode: ERROR.METAMASK_NO_LOGIN
        });
        break;
      case ERROR.DENIED_ACCESS:
        // user denied connection
        this.setState({
          checking: false,
          showErrorMessage: true,
          messageCode: ERROR.DENIED_ACCESS
        });
        break;
      default:
        // good web3 obtained, so grab everything
        log("APP setupEthereumEnv finishConnection web3", web3);
        await this.finishConnection(web3);
    }

    //log("APP setupEthereumEnv end state", this.state);
  };

  /*
    connect web3 provider
    get user Eth address
    get erc20 factory truffle instance
    attempt to get all token info user may have
  */
  finishConnection = async web3 => {
    this.factoryAbstraction.setProvider(web3.currentProvider);
    this.tokenAbstraction.setProvider(web3.currentProvider);

    log("APP this.factoryAbstraction", this.factoryAbstraction);

    let tmp_address = await getEthAccountUtil(0, web3);
    log("APP tmp_address", tmp_address);

    if (tmp_address) {
      let tmp_factory = null;
      if (this.factoryAbstraction) {
        tmp_factory = await getContractUtil(this.factoryAbstraction);
      }
      log("APP tmp_factory", tmp_factory);

      let tmp_count = 0,
        tokenInfos = [],
        showTokens = false;
      if (tmp_factory !== 0) {
        tmp_count = await getTokenCountUtil(tmp_factory, tmp_address);
        // given tmp_count, how many tokens the user, and tmp_address,
        // obtain all token information for children to consume
        tokenInfos = await this.getAllTokenInfo(
          tmp_count,
          tmp_address,
          tmp_factory
        );
        log("APP tokenInfos", tokenInfos);
        log("APP tmp_count", tmp_count);

        if (Number(tmp_count) > 0) showTokens = true;
        this.setState({
          userEthAddr: tmp_address,
          factory: tmp_factory,
          tokenInfoArray: [...this.state.tokenInfoArray, ...tokenInfos],
          checking: false,
          showTokens: showTokens,
          connected: true
        });
      } else {
        // no factory
        log("no factory");
        this.setState({
          userEthAddr: tmp_address,
          checking: false,
          showErrorMessage: true,
          messageCode: ERROR.NO_FACTORY
        });
      }
    }
  };

  onConnect = async () => {
    //log("APP onConnect props", props);
    let web3 = await getWeb3(true);
    log("APP onConnect web3", web3);
    await this.setupEthereumEnv(web3);
  };
  render() {
    //log("APP render state", this.state);
    return (
      <Grid columns="equal" centered>
        <Grid.Row>
          <Menu fluid widths={1}>
            <Menu.Item header>erc20 token manager</Menu.Item>
          </Menu>
        </Grid.Row>

        <Grid.Row>
          <TokenCreateForm
            factory={this.state.factory}
            userEthAddress={this.state.userEthAddr}
            addToken={this.addToken}
            connected={this.state.connected}
          />
        </Grid.Row>
        <Grid.Row>
          <RetrieveTokenForm
            updateTokenRender={this.updateTokenRender}
            connected={this.state.connected}
          ></RetrieveTokenForm>
        </Grid.Row>
        <Grid.Row>
          <Greeter
            userEthAddress={this.state.userEthAddr}
            showTokens={this.state.showTokens}
            connected={this.state.connected}
            checking={this.state.checking}
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
            tokenAbstraction={this.tokenAbstraction}
            updateTokenRender={this.updateTokenRender}
          />
        </Grid.Row>
        <Grid.Row>
          {/*TODO: very ugly 3 nested ternary statements. we choose:
          while checking connection, show nothing       
          if appropriate, show error message
          if appropriate, show connect button
          otherwise, show nothing
          these are shown exclusively of each other
          */}
          {this.state.checking ? (
            <></>
          ) : this.state.showErrorMessage ? (
            <ErrorMessage messageCode={this.state.messageCode}></ErrorMessage>
          ) : !this.state.connected ? (
            <Button onClick={this.onConnect}>Connect to MetaMask</Button>
          ) : (
            <></>
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
