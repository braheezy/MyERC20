import React, { Component } from "react";
import { List, Dimmer, Loader } from "semantic-ui-react";
import TruffleContract from "truffle-contract";
import TokenCard from "./TokenCard";
import MyERC20 from "../token";
import web3 from "../web3";
import { getContractUtil } from "../data_utils";

class TokenSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasTokens: false,
      tokens: [],
      checking: true
    };
    // console.log("TokenSegment constructor");
  }
  componentDidMount() {
    // Get token info for each created token and add to state
    // console.log("TokenSegment didMount state", this.state);
  }
  async componentDidUpdate(prevProps) {
    // console.log("TokenSegment didUpdate props", this.props);
    let chk,
      hsTk,
      tk = 0;
    if (this.props !== prevProps) {
      if (this.props.checking !== prevProps.checking) {
        chk = this.props.checking;
      }
      if (this.props.count > 0) {
        tk = await this.updateTokenInfo(this.props);
        hsTk = true;
      } else {
        hsTk = false;
      }
      if (tk !== 0 && tk !== undefined) {
        this.setState({
          hasTokens: hsTk,
          tokens: [...this.state.tokens, ...tk],
          checking: chk
        });
      } else {
        this.setState({
          hasTokens: hsTk,
          checking: chk
        });
      }
    }
  }
  async updateTokenInfo(props) {
    // get token info for index _count_
    let results = [];
    for (var i = 0; i < props.count; i++) {
      let tokenAddress;
      try {
        tokenAddress = await props.factory.tokenHolders(props.address, i);
      } catch (err) {
        console.log("*****4****", err);
      }
      let token = TruffleContract(MyERC20);
      token.setProvider(web3.currentProvider);

      // console.log("tokenAddress: " + tokenAddress);
      let tokenInst = await getContractUtil(token, tokenAddress);

      let name, supply, sym, dec;
      name = await tokenInst.name();
      supply = await tokenInst.totalSupply();
      sym = await tokenInst.symbol();
      dec = await tokenInst.decimals();

      let result = {
        address: tokenInst.address,
        name: name,
        supply: supply.toString(),
        symbol: sym,
        decimals: dec.toString(),
        rendered: false
      };
      // console.log("TokenSegment updateTokenInfo result", result);
      results.push(result);
    }
    return results;
  }

  deleteToken = async address => {
    let copy = this.state.tokens;
    console.log("copy", copy);

    let result = copy.filter(token => token.address !== address);
    console.log("result", result);

    this.setState({ tokens: result });
    console.log("TokenSegment deleteToken", this.props);
    await this.props.updateCount(false);
  };
  render() {
    const { hasTokens, tokens, checking } = this.state;
    console.log("TokenSegment render state", this.state);
    if (hasTokens === true && tokens.length > 0) {
      const tokenList = tokens.map(token => {
        return (
          <TokenCard
            key={token.address.toString()}
            address={token.address.toString()}
            name={token.name}
            symbol={token.symbol}
            supply={token.supply}
            onDeleteClick={this.deleteToken}
          />
        );
      });

      return <List className="tokenInfoList">{tokenList}</List>;
    } else if (checking) {
      // console.log("TokenSegment render returning loader");
      return (
        <Dimmer inverted active style={{ height: "5em" }}>
          <Loader size="tiny">Fetching tokens...</Loader>
        </Dimmer>
      );
    } else {
      return <></>;
    }
  }
}

export default TokenSegment;
