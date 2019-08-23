import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { cleanupAddress } from "../data_utils";

class Greeter extends Component {
  renderText(props) {
    let text;
    // eslint-disable-next-line
    if (props.userEthAddress == 0 || props.userEthAddress == undefined) {
      text = (
        <p>
          We can't find an Ethereum address for you :(
          <br />
          Are you logged in to MetaMask?
          <br />
          Should you be running Ganache?
        </p>
      );
    } else if (props.showTokens) {
      // They have tokens
      text = (
        <p>
          Hello {cleanupAddress(props.userEthAddress)}! Here are your tokens:
        </p>
      );
    } else {
      // haven't made tokens yet
      text = (
        <>
          <p>Hello {cleanupAddress(props.userEthAddress)}!</p>
          <p>Looks like you haven't made any tokens yet :(</p>
          <p>Why don't you go ahead and make one?</p>
        </>
      );
    }
    return text;
  }

  render() {
    return (
      <Container textAlign="center">{this.renderText(this.props)}</Container>
    );
  }
}

export default Greeter;
