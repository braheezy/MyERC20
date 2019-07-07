import React, { Component } from "react";
import { Form, Divider } from "semantic-ui-react";

class TokenForm extends Component {
  state = { name: "", supply: "", symbol: "", decimal: "" };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.factory !== undefined) {
        this.setState({ factory: this.props.factory });
      }
      if (this.props.address !== undefined) {
        this.setState({ address: this.props.address });
      }
    }
  }

  handleChange = (e, { name, value }) => {
    if (name === "supply" || name === "decimal") value = parseInt(value);
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { name, supply, symbol, decimal, factory, address } = this.state;
    console.log("handleSumbmit state", this.state);
    console.log(this.props);
    try {
      await factory.createToken(supply, name, symbol, decimal, {
        from: address
      });
    } catch (err) {
      console.log(err);
    }
    this.props.updateCount(true);
    this.setState({ name: "", supply: "", symbol: "", decimal: "" });
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Button
          primary
          size="big"
          content="Create Token"
          active={this.activeItem}
          onClick={this.onClick}
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
          placeholder="Total Supply"
          name="supply"
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
          onChange={this.handleChange}
          value={this.state.decimal}
        />
      </Form>
    );
  }
}

export default TokenForm;
