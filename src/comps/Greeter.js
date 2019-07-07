import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { cleanupAddress } from "../data_utils";

class Greeter extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     count: 0
  //   };
  // }
  // componentDidUpdate(prevProps) {
  //   if (this.props !== prevProps) {
  //     if (this.props.count !== undefined) {
  //       this.setState({ count: this.props.count });
  //     }
  //   }
  // }

  renderText(props) {
    let text;

    if (props.ethAddress == 0 || props.ethAddress == undefined) {
      text = (
        <p>
          We can't find an Ethereum address for you :(
          <br />
          Are you logged in to MetaMask?
          <br />
          Should you be running Ganache?
        </p>
      );
      return text;
    }
    if (props.count > 0) {
      // They have tokens
      text = (
        <p>Hello {cleanupAddress(props.ethAddress)}! Here are your tokens:</p>
      );
    } else {
      text = (
        <>
          <p>Hello {cleanupAddress(props.ethAddress)}!</p>
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
