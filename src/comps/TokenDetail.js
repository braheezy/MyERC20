import React, { Component } from "react";
import { Modal, Button, Header, Segment, Grid } from "semantic-ui-react";
import TokenInteractionForm from "./TokenInteractionForm";
import { log } from "../data_utils";

class TokenDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  handleOpen = () => {
    log("tokenDetail Open props", this.props);
    this.setState({ modalOpen: true });
  };

  render() {
    return (
      <Modal
        trigger={
          <Button
            basic
            color="green"
            onClick={this.handleOpen}
            open={this.state.modalOpen}
          >
            View
          </Button>
        }
      >
        <Modal.Header>Token Detail: {this.props.name}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Segment.Group compact>
              <Segment>Address: {this.props.fullTokenAddress}</Segment>
              <Segment>Symbol: {this.props.symbol}</Segment>
              <Segment>Supply: {this.props.supply} Wei</Segment>
              <Segment>Decimal: {this.props.decimals}</Segment>
              <Segment>
                <Header>Your Balance: {this.props.balance} Wei</Header>
              </Segment>

              <Segment>
                <Grid padded="horizontally">
                  <Grid.Row>
                    <Header>Interact with your token</Header>
                  </Grid.Row>
                  <Grid.Row>
                    <TokenInteractionForm
                      tokenAddress={this.props.fullTokenAddress}
                      tokenAbstraction={this.tokenAbstraction}
                    />
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default TokenDetail;
