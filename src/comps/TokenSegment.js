import React, { Component } from "react";
import { List, Dimmer, Loader } from "semantic-ui-react";
import TokenCard from "./TokenCard";
import { cleanupAddress, log } from "../data_utils";

class TokenSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // controls dimmer for async tasks App parent is doing
      checking: true
    };
  }

  render() {
    //log("TOKEN_SEGMENT render props", this.props);
    if (this.props.showTokens === true) {
      const tokenList = this.props.tokenInfoArray.map((token, index) => {
        //log("TOKEN_SEGMENT render map token", token);
        //log("TOKEN_SEGMENT render map token index", index);
        if (token.render === true) {
          return (
            <TokenCard
              key={token.address.toString()}
              tokenAddress={cleanupAddress(token.address.toString())}
              fullTokenAddress={token.address.toString()}
              name={token.name}
              symbol={token.symbol}
              supply={token.supply}
              decimals={token.decimals}
              updateTokenRender={this.props.updateTokenRender}
              userEthAddress={this.props.userEthAddress}
              tokenAbstraction={this.props.tokenAbstraction}
            />
          );
        } else return <div key={index}></div>;
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
