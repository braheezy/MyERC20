import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import { log } from "../data_utils";
import { ERROR } from "../errorCodes";

class ErrorMessage extends Component {
  renderMessageText = idx => {
    switch (idx) {
      case 0:
        // user needs to click connect button and enable metamask
        break;
      case ERROR.METAMASK_NO_LOGIN:
        // not logged in
        return "Not logged into MetaMask.";
      case ERROR.DENIED_ACCESS:
        // user denied connection
        break;
      case ERROR.NO_FACTORY:
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
        content={this.renderMessageText(this.props.messageCode)}
      ></Message>
    );
  }
}

export default ErrorMessage;
