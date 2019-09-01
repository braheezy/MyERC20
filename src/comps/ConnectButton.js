import React, { Component } from "react";
import { Button } from "semantic-ui-react";

class ConnectButton extends Component {
  constructor(props) {
    super(props);
  }

  onConnect = (e, props) => {};
  render() {
    return <Button onClick={this.onConnect}>Connect to MetaMask</Button>;
  }
}

export default ConnectButton;
