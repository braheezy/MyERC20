import React, { Component } from "react";
import { Card, Grid, Header, Button } from "semantic-ui-react";
import TokenDetail from "./TokenDetail";
import { getBalance, log } from "../data_utils";

class TokenCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0
    };
  }

  // do things specific to the user for this token
  /*
  balance
  ...
  */
  async componentDidMount() {
    let balance = await getBalance(
      this.props.fullTokenAddress,
      this.props.userEthAddress
    );
    this.setState({ balance: balance.toNumber() });
  }

  onDeleteClick = () => {
    log("onDeleteClick", this.props);
    this.props.onDeleteClick(this.props.fullTokenAddress);
  };

  render() {
    const { balance } = this.state;
    return (
      <Card className="tokenInfo">
        <Card.Content extra>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header floated="left">{this.props.name}</Header>
              </Grid.Column>
              <Grid.Column>
                <Header floated="right">{this.props.supply}</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign="left">
                <Card.Description>{this.props.tokenAddress}</Card.Description>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Card.Description>{this.props.symbol}</Card.Description>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>

        <Card.Content extra>
          <div className="ui two buttons">
            <TokenDetail
              name={this.props.name}
              supply={this.props.supply}
              fullTokenAddress={this.props.fullTokenAddress}
              symbol={this.props.symbol}
              decimals={this.props.decimals}
              balance={balance}
            />
            <Button basic color="red" onClick={this.onDeleteClick}>
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default TokenCard;
