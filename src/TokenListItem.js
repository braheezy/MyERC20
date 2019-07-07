import React from "react";
import { List } from "semantic-ui-react";

class TokenListItem extends List.Item {
  render() {
    return (
      <List.Item>
        <List.Content>
          <List.Header>Token 1</List.Header>
          <List.Description>TKN1</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default TokenListItem;
