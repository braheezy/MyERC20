import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { cleanupAddress, log } from "../data_utils";

class Greeter extends Component {
  renderText(props) {
    log("GREETER renderText props", props);
    const { checking, connected, userEthAddress, showTokens } = props;
    let text;
    // if still checking or no metamask connection, no text
    if (checking) {
      text = <p></p>;
    }
    // connected means we have an eth address, among other things
    else if (connected) {
      if (showTokens) {
        // also have tokens
        text = (
          <p>
            Hello {cleanupAddress(props.userEthAddress)}! Here are your tokens:
          </p>
        );
      } else {
        text = (
          <>
            <p>Hello {cleanupAddress(props.userEthAddress)}!</p>
            <p>Looks like you haven't made any tokens yet :(</p>
            <p>Why don't you go ahead and make one?</p>
          </>
        );
      }
    }
    // not connected
    else if (userEthAddress) {
      text = <p> Hello {cleanupAddress(props.userEthAddress)}!</p>;
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
