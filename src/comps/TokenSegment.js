import React, { Component } from "react";
import { List, Dimmer, Loader } from "semantic-ui-react";
import TokenCard from "./TokenCard";
import { cleanupAddress, log } from "../data_utils";

class TokenSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all the token info
      tokens: [
        /*
        [
          {
            id:               int,
            tokenAddress:     string,
            render:           bool,
            supply:           int,
            name:             string,
            symbol:           string,
            decimals:          int,
          },
        ]
        */
      ],
      // controls dimmer for async tasks App parent is doing
      checking: true
    };
  }

  componentDidMount() {
    log("TOKEN_SEGMENT didMount props", this.props);
  }

  async componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      log("TOKEN_SEGMENT didUpdate props", this.props);
      log("TOKEN_SEGMENT didUpdate prevProps", prevProps);
      // only way for array length to change from props is an increase
      if (
        this.props.tokenInfoArray.length !== prevProps.tokenInfoArray.length
      ) {
        let newTokenCount =
          this.props.tokenInfoArray.length - prevProps.tokenInfoArray.length;
        log("TOKEN_SEGMENT tokenInfoArray length changed by", newTokenCount);
        /* 
        either adding one or many tokens
        if adding many, first render
        if adding one,
          may be doing first render of 1 token
          may be adding 1 token to many tokens
        
        only parse new tokens, from old length
        */
        let newTokens = this.props.tokenInfoArray.slice(
          prevProps.tokenInfoArray.length
        );
        log("TOKEN_SEGMENT didUpdate newTokens slice", newTokens);
        newTokens = newTokens.map(token => {
          return this.parseNewTokenInfo(token);
        });
        log("TOKEN_SEGMENT didUpdate newTokens", newTokens);
        this.setState(previousState => ({
          tokens: [...previousState.tokens, ...newTokens]
        }));
      }
    }
    log("TOKEN_SEGMENT didUpdate final state", this.state);
  }

  // parse info object and stuff with data TokenSegment needs
  parseNewTokenInfo(token) {
    let result = {
      tokenAddress: token.tokenAddress,
      name: token.name,
      supply: token.supply.toString(),
      symbol: token.symbol,
      decimals: token.decimals.toString(),
      render: true
    };
    log("TOKEN_SEGMENT parseNewTokenInfo result", result);
    return result;
  }

  deleteToken = address => {
    let copy;
    log("TOKEN_SEGMENT deleteToken this.state", this.state);

    // make copy of React state because it should be immutable
    copy = [...this.state.tokens];
    log("TOKEN_SEGMENT deleteToken copy", copy);

    // find the token to delete and update render flag
    copy.find(token => token.tokenAddress === address).render = false;

    // if all token render flags are false, update greeter
    let renderCount = copy.every(token => token.render === false);
    log("TOKEN_SEGMENT renderCount", renderCount);
    if (renderCount === true) {
      log("TOKEN_SEGMENT about to hide greeter");
      this.props.hideTokenGreeter();
    }
    this.setState({ tokens: copy });
  };

  render() {
    const { tokens } = this.state;
    log("TOKEN_SEGMENT render state", this.state);
    if (this.props.showTokens === true) {
      const tokenList = tokens.map((token, index) => {
        log("TOKEN_SEGMENT render map token", token);
        if (token.render === true) {
          return (
            <TokenCard
              key={index}
              tokenAddress={cleanupAddress(token.tokenAddress.toString())}
              fullTokenAddress={token.tokenAddress.toString()}
              name={token.name}
              symbol={token.symbol}
              supply={token.supply}
              decimals={token.decimals}
              onDeleteClick={this.deleteToken}
              userEthAddress={this.props.userEthAddress}
              tokenAbstraction={this.props.tokenAbstraction}
            />
          );
        } else return <></>;
      });

      return <List className="tokenInfoList">{tokenList}</List>;
    } else if (this.props.checking) {
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
