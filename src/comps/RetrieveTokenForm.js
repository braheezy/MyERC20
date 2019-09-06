import React, { Component } from "react";
import { Form, Header } from "semantic-ui-react";
import { log } from "../data_utils";

class RetrieveTokenForm extends Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleSubmit = () => {
    //log("RETRIEVE_TOKEN_FORM handleSubmit state", this.state);
    const { address } = this.state;
    this.props.updateTokenRender(address, "retrieve");
    this.setState({ address: "" });
  };

  handleChange = (e, { value }) => {
    //log("RETRIEVE_TOKEN_FORM handleChange value", value);
    this.setState({ address: value });
    //log("RETRIEVE_TOKEN_FORM handleChange post state", this.state);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Header content="Retrieve Tokens Here:" />
        <Form.Group>
          <Form.Button content="Get it" disabled={!this.props.connected} />
          <Form.Input
            placeholder="Address..."
            onChange={this.handleChange}
            value={this.state.address}
          />
        </Form.Group>
      </Form>
    );
  }
}

export default RetrieveTokenForm;
