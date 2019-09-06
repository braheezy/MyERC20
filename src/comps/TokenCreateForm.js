import React, { Component } from "react";
import { Form, Divider } from "semantic-ui-react";
import { log } from "../data_utils";

class TokenCreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = { name: "", supply: "", symbol: "", decimal: "" };
  }

  handleChange = (e, { name, value }) => {
    // TODO: need to let user know we only take int
    if (name === "supply" || name === "decimal") value = parseInt(value);
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { name, supply, symbol, decimal } = this.state;
    const { factory, userEthAddress } = this.props;
    let success = false;
    try {
      await factory.createToken(supply, name, symbol, decimal, {
        from: userEthAddress
      });
      success = true;
    } catch (err) {
      log("TOKEN_CREATE_FORM*********", err);
      return 0;
    }
    if (success) {
      this.props.addToken();
    }
    this.setState({ name: "", supply: "", symbol: "", decimal: "" });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Button
          primary
          size="big"
          content="Create Token"
          disabled={!this.props.connected}
        />
        <Divider hidden />
        <Form.Input
          label="Token Name"
          placeholder="Token Name"
          name="name"
          onChange={this.handleChange}
          value={this.state.name}
        />
        <Form.Input
          label="Total Supply"
          placeholder="Total Supply (wei)"
          name="supply"
          type="number"
          required
          onChange={this.handleChange}
          value={this.state.supply}
        />
        <Form.Input
          label="Token Symbol"
          placeholder="Token Symbol"
          name="symbol"
          onChange={this.handleChange}
          value={this.state.symbol}
        />
        <Form.Input
          label="Decimals"
          placeholder="Decimals"
          name="decimal"
          min="0"
          max="128"
          type="number"
          onChange={this.handleChange}
          value={this.state.decimal}
        />
      </Form>
    );
  }
}

export default TokenCreateForm;
