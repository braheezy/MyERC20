import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import { log } from "../data_utils";

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    log("META_MASK_MESSAGE didMount props", this.props);
  }

  renderMessageText = idx => {
    switch (idx) {
      case 0:
        // user needs to click connect button and enable metamask
        break;
      case 1:
        // not logged in
        return "Not logged into MetaMask.";
        break;
      case 2:
        // user denied connection
        break;
      case 3:
        // metamask good, no factory
        return "Cannot find ERC20 factory to interact with.";
      default:
    }
  };

  render() {
    log("META_MASK_MESSAGE render props", this.props);
    return (
      <Message
        error
        content={this.renderMessageText(this.props.messageReason)}
      ></Message>
    );
  }
}

export default ErrorMessage;
