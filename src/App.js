import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { Greeter, Banner, TokenSegment, TokenForm } from "./comps";
import "./App.css";
import web3 from "./web3";
import ERC20Factory from "./factory.json";
import TruffleContract from "truffle-contract";
import {
  getEthAccountUtil,
  getContractUtil,
  getTokenCountUtil,
  updateCountUtil
} from "./data_utils";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEthAddr: 0x0,
      tokenCount: 0,
      factory: "",
      checking: true
    };

    console.log(web3);
    this.ercFactory = TruffleContract(ERC20Factory);
    this.ercFactory.setProvider(web3.currentProvider);
  }
  async componentDidMount() {
    let tmp_address = await getEthAccountUtil(0);
    console.log("tmp_address", tmp_address);

    let tmp_factory = await getContractUtil(this.ercFactory);
    console.log("tmp_factory", tmp_factory);

    let tmp_count = await getTokenCountUtil(tmp_factory, tmp_address);
    console.log("tmp_count", tmp_count);

    this.setState({
      userEthAddr: tmp_address,
      factory: tmp_factory,
      tokenCount: Number(tmp_count),
      checking: false
    });
  }

  // So children can update the count when the user creates/deletes tokens
  updateCount = async increase => {
    let count;
    if (increase) {
      count = this.state.tokenCount + 1;
    } else {
      count = this.state.tokenCount - 1;
      await updateCountUtil(this.state.factory, count, this.state.userEthAddr);
    }
    console.log("updateCount new count", count);

    this.setState({ tokenCount: count });
  };
  render() {
    return (
      <Grid columns="equal" centered>
        <Grid.Row>
          <Banner />
        </Grid.Row>

        <Grid.Row>
          <TokenForm
            factory={this.state.factory}
            address={this.state.userEthAddr}
            updateCount={this.updateCount}
          />
        </Grid.Row>
        <Grid.Row>
          <Greeter
            ethAddress={this.state.userEthAddr}
            count={this.state.tokenCount}
          />
        </Grid.Row>

        <Grid.Row>
          <TokenSegment
            count={this.state.tokenCount}
            factory={this.state.factory}
            address={this.state.userEthAddr}
            updateCount={this.updateCount}
            checking={this.state.checking}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
