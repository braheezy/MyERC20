import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

class Banner extends Component {
  render() {
    return (
      <Menu fluid widths={1}>
        <Menu.Item header>erc20 token manager</Menu.Item>
      </Menu>
    );
  }
}

export default Banner;
