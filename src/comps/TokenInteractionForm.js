import React, { Component } from "react";
import { Form, Grid, Segment, Message } from "semantic-ui-react";
import {
  getEthAccountUtil,
  getContractUtil,
  getBalance,
  getAllowance,
  log
} from "../data_utils";
import MyERC20 from "../token";
import web3 from "../web3";
import TruffleContract from "truffle-contract";

class TokenInteractionForm extends Component {
  constructor(props) {
    super(props);

    let tokenContractAbs = TruffleContract(MyERC20);
    tokenContractAbs.setProvider(web3.currentProvider);

    this.state = {
      tokenContractAbs: tokenContractAbs,
      userEthAddr: "",
      token: "",
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
  async componentDidMount() {
    let tmp_address = await getEthAccountUtil(0);

    let tmp_token = await getContractUtil(
      this.state.tokenContractAbs,
      this.props.tokenAddress
    );

    this.setState({
      userEthAddr: tmp_address,
      token: tmp_token,
      tokenAddress: this.props.tokenAddress
    });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleTransferSubmit = async () => {
    this.setState({ transferLoading: true });
    const { transferTo, token, userEthAddr } = this.state;
    let { transferAmount } = this.state;
    log(this.state);
    transferAmount = parseFloat(transferAmount);

    await token.transfer(transferTo, transferAmount, {
      from: userEthAddr
    });
    this.setState({
      transferTo: "",
      transferAmount: "",
      transferLoading: false,
      transferSuccess: true
    });
  };

  // handle known exploit
  handleApproveSubmit = async () => {
    this.setState({ approveLoading: true });
    const { approvee, token, userEthAddr } = this.state;
    let { approveeAllowance } = this.state;
    log(this.state);
    approveeAllowance = parseFloat(approveeAllowance);

    await token.approve(approvee, approveeAllowance, {
      from: userEthAddr
    });
    this.setState({
      approvee: "",
      approveeAllowance: "",
      approveSuccess: true,
      approveLoading: false
    });
  };

  handleBalanceCheckSubmit = async () => {
    const { tokenAddress, balance_account } = this.state;
    log(this.state);
    let balance = await getBalance(tokenAddress, balance_account);
    log("handled balance check", balance);
    const addr = balance_account;
    this.setState({
      balance_account: "",
      balance_account_address: addr,
      showBalance: true,
      balance: balance.toNumber()
    });
  };

  handleAllowanceCheckSubmit = async () => {
    const { tokenAddress, allowance_account, userEthAddr } = this.state;
    log(this.state);
    let allowance = await getAllowance(
      this.props.tokenAbstraction,
      tokenAddress,
      userEthAddr,
      allowance_account
    );
    const addr = allowance_account;
    log("handled allowance check", allowance);
    this.setState({
      allowance_account: "",
      allowance_account_address: addr,
      showAllowance: true,
      allowance: allowance.toNumber()
    });
  };

  handleTransferToSubmit = async () => {
    this.setState({ transferToLoading: true });
    const { transferTo_To, transferTo_From, token, userEthAddr } = this.state;
    let { transferTo_Amount } = this.state;
    transferTo_Amount = parseFloat(transferTo_Amount);

    await token.transferFrom(
      transferTo_From,
      transferTo_To,
      transferTo_Amount,
      { from: userEthAddr }
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
    log("redner showBalance", showBalance);
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
