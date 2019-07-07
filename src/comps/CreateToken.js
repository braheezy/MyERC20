import React, { Component } from "react";
import TokenForm from "./TokenForm";

class CreateToken extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = async () => {
    this.setState({ activeItem: true });
  };

  render() {
    return (
      <div>
        <TokenForm />
      </div>
    );
  }
}

export default CreateToken;
