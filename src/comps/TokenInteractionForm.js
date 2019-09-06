import React, { Component } from "react";
import { Form, Grid, Segment, Message } from "semantic-ui-react";
import { getBalance, getAllowance, log } from "../data_utils";

class TokenInteractionForm extends Component {
  constructor(props) {
    super(props);
    //log("TOKEN_INTERACTION_FORM constructor props", props);

    this.state = {
      transferTo: "",
      transferAmount: "",
      approvee: "",
      approveeAllowance: "",
      transferTo_From: "",
      transferTo_To: "",
      transferTo_Amount: "",
      balance_account: "",
      balance_account_address: "",
      allowance_account: "",
      allowance_account_address: "",
      showBalance: false,
      showAllowance: false,
      transferSuccess: false,
      transferLoading: false,
      approveLoading: false,
      approveSuccess: false,
      balance: 0,
      allowance: 0
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleTransferSubmit = async () => {
    this.setState({ transferLoading: true });
    const { transferTo } = this.state;
    const { tokenInstance, userEthAddress } = this.props;
    let { transferAmount } = this.state;
    transferAmount = parseFloat(transferAmount);

    await tokenInstance.transfer(transferTo, transferAmount, {
      from: userEthAddress
    });
    this.setState({
      transferTo: "",
      transferAmount: "",
      transferLoading: false,
      transferSuccess: true
    });
  };

  //TODO: handle known exploit
  handleApproveSubmit = async () => {
    this.setState({ approveLoading: true });
    const { approvee } = this.state;
    const { tokenInstance, userEthAddress } = this.props;
    let { approveeAllowance } = this.state;
    approveeAllowance = parseFloat(approveeAllowance);

    await tokenInstance.approve(approvee, approveeAllowance, {
      from: userEthAddress
    });
    this.setState({
      approvee: "",
      approveeAllowance: "",
      approveSuccess: true,
      approveLoading: false
    });
  };

  handleBalanceCheckSubmit = async () => {
    const { balance_account } = this.state;
    const { tokenInstance } = this.props;
    let balance = await getBalance(tokenInstance, balance_account);
    //log("handled balance check", balance);
    const addr = balance_account;
    this.setState({
      balance_account: "",
      balance_account_address: addr,
      showBalance: true,
      balance: balance.toNumber()
    });
  };

  handleAllowanceCheckSubmit = async () => {
    const { allowance_account } = this.state;
    const { userEthAddress, tokenInstance } = this.props;
    let allowance = await getAllowance(
      tokenInstance,
      userEthAddress,
      allowance_account
    );
    const addr = allowance_account;
    //log("handled allowance check", allowance);
    this.setState({
      allowance_account: "",
      allowance_account_address: addr,
      showAllowance: true,
      allowance: allowance.toNumber()
    });
  };

  handleTransferToSubmit = async () => {
    this.setState({ transferToLoading: true });
    const { transferTo_To, transferTo_From } = this.state;
    const { tokenInstance, userEthAddress } = this.props;
    let { transferTo_Amount } = this.state;
    transferTo_Amount = parseFloat(transferTo_Amount);

    await tokenInstance.transferFrom(
      transferTo_From,
      transferTo_To,
      transferTo_Amount,
      { from: userEthAddress }
    );
    this.setState({
      transferTo_From: "",
      transferTo_To: "",
      transferTo_Amount: "",
      transferToLoading: false,
      transferToSuccess: true
    });
  };

  handleDismiss = (e, { name }) => {
    this.setState({ [name]: false });
  };

  render() {
    const {
      showBalance,
      showAllowance,
      transferSuccess,
      transferLoading,
      approveLoading,
      approveSuccess,
      balance,
      allowance,
      allowance_account,
      allowance_account_address,
      balance_account,
      balance_account_address,
      transferToLoading,
      transferToSuccess
    } = this.state;
    //log("render showBalance", showBalance);
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form
              loading={transferLoading}
              success={transferSuccess}
              onSubmit={this.handleTransferSubmit}
            >
              <Message
                success
                header="Transfer Successful!"
                name="transferSuccess"
                onDismiss={this.handleDismiss}
              />
              <Form.Button content="Transfer" />
              <Form.Input
                required
                name="transferTo"
                placeholder="to (address)"
                onChange={this.handleChange}
                value={this.state.transferTo}
              />
              <Form.Input
                required
                name="transferAmount"
                placeholder="amount (ether)"
                onChange={this.handleChange}
                value={this.state.transferAmount}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form
              loading={approveLoading}
              success={approveSuccess}
              onSubmit={this.handleApproveSubmit}
            >
              <Message
                success
                name="approveSuccess"
                header="Appoval Successful!"
                onDismiss={this.handleDismiss}
              />
              <Form.Button content="Approve" />
              <Form.Input
                required
                placeholder="approvee (address)"
                name="approvee"
                onChange={this.handleChange}
                value={this.state.approvee}
              />
              <Form.Input
                required
                placeholder="allowance (ether)"
                name="approveeAllowance"
                onChange={this.handleChange}
                value={this.state.approveeAllowance}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Form
              loading={transferToLoading}
              success={transferToSuccess}
              onSubmit={this.handleTransferToSubmit}
            >
              <Message
                success
                header="Transfer To {addr} Successful!"
                name="transferToSuccess"
                onDismiss={this.handleDismiss}
              />
              <Form.Button content="Transfer To" />
              <Form.Input
                required
                placeholder="from (address)"
                name="transferTo_From"
                onChange={this.handleChange}
                value={this.state.transferTo_From}
              />
              <Form.Input
                required
                placeholder="to (address)"
                name="transferTo_To"
                onChange={this.handleChange}
                value={this.state.transferTo_To}
              />
              <Form.Input
                required
                name="transferTo_Amount"
                placeholder="amount (ether)"
                onChange={this.handleChange}
                value={this.state.transferTo_Amount}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Form onSubmit={this.handleBalanceCheckSubmit}>
              <Form.Button content="Check Balance Of" />
              <Form.Input
                required
                name="balance_account"
                placeholder="account (address)"
                onChange={this.handleChange}
                value={balance_account}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            {showBalance ? (
              <Segment>
                <h4>Address</h4>
                {balance_account_address}
                <h4>Balance</h4>
                {balance}
              </Segment>
            ) : null}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form onSubmit={this.handleAllowanceCheckSubmit}>
              <Form.Button content="Check Allowance Of" />
              <Form.Input
                required
                name="allowance_account"
                placeholder="account (address)"
                onChange={this.handleChange}
                value={allowance_account}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            {showAllowance ? (
              <Segment>
                <h4>Address</h4>
                {allowance_account_address}
                <h4>Allowance</h4>
                {allowance}
              </Segment>
            ) : null}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default TokenInteractionForm;
