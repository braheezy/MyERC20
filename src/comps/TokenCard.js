import React, { Component } from "react";
import { Card, Grid, Header, Button } from "semantic-ui-react";
import TokenDetail from "./TokenDetail";

class TokenCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewClicked: false
    };
  }

  onViewClick = () => {
    console.log("TokenInfoSegment");
    console.log(this.props);
  };

  onDeleteClick = () => {
    console.log("onDeleteClick", this.props);
    this.props.onDeleteClick(this.props.address);
  };

  render() {
    const { viewClicked } = this.state;
    let view;
    if (viewClicked) {
      view = <TokenDetail />;
    } else {
      view = (
        <Card className="tokenInfo" fluid>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Column>
                <Header floated="left">{this.props.name}</Header>
              </Grid.Column>
              <Grid.Column>
                <Header floated="right">{this.props.supply}</Header>
              </Grid.Column>
            </Grid>
            <Card.Description textAlign="left">
              {this.props.symbol}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <div className="ui two buttons">
              <Button basic color="green" onClick={this.onViewClick}>
                View
              </Button>
              <Button basic color="red" onClick={this.onDeleteClick}>
                Delete
              </Button>
            </div>
          </Card.Content>
        </Card>
      );
    }
    return <>{view}</>;
  }
}

export default TokenCard;
