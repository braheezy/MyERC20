pragma solidity >=0.5.0 <0.7.0;

contract MyERC20 {
  uint public totalSupply;
  string public name;
  string public symbol;
  uint8 public decimals;
  mapping (address => uint) public balanceOfTokenHolder;

  // A mapping of token holder's to their approved senders, with their allowance
  mapping (address => mapping (address => uint)) approvers;

  /*
  MUST trigger when tokens are transferred, including zero value
  transfers.A token contract which creates new tokens SHOULD trigger
  a Transfer event with the _from address set to 0x0 when tokens are
  created.
  */
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  constructor(uint _initalSupply, string memory _name, string memory _symbol, uint8 _decimals) public {
    totalSupply = _initalSupply;
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    balanceOfTokenHolder[msg.sender] = _initalSupply;
  }

  /**
  * @notice Transfer tokens to an address
  * @param _value amount of tokens
  * @param _to address receiving tokens
  * @return true if the transfer was successful
  */
  function transfer(address _to, uint256 _value) external returns (bool success) {
    //  1. require msg.sender has enough tokens (and protect against overflow)
    //  2. deduct tokens from sender
    //  3. add tokens to _to
    //  4. emit transfer event
    require(balanceOfTokenHolder[msg.sender] >= _value,
            "sender does not have enough tokens");
    require(balanceOfTokenHolder[_to] + _value >= balanceOfTokenHolder[_to],
    "overflow protection for receiver");
    balanceOfTokenHolder[msg.sender] -= _value;
    balanceOfTokenHolder[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @notice Allows an entity to withdraw from your account multiple times
  * @dev Ensure the client properly handle the known exploit, namely, that they
         set the allowance to 0 before setting it to the new value.
  * @param _spender address of approved entity
  * @param _value how many tokens the approved entity can ultimately withdraw
  * @return true if the approver was successfully added
  */
  function approve(address _spender, uint256 _value) external returns (bool success){
    approvers[msg.sender][_spender] = _value;
    return true;
  }

  /**
  * @notice Transfer tokens to an address
  * @param _value amount of tokens
  * @param _from address sending tokens
  * @param _to address receiving tokens
  * @return true if the transfer was successful
  */
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
    //  1. msg.sender must have enough allowance
    //  2.  _from must have enough tokens (and protect _to from overflow)
    //  3. deduct _value from msg.sender's allowance
    //  4. deduct tokens from sender
    //  5. add tokens to _to
    //  6. emit transfer event
    //  7. return success
    require(approvers[_from][msg.sender] >= _value, "not authorized to transfer tokens");
    require(balanceOfTokenHolder[_from] >= _value, "not enough tokens");
    require(balanceOfTokenHolder[_to] + _value >= balanceOfTokenHolder[_to], "overflow protection for receiver");
    approvers[_from][msg.sender] -= _value;
    balanceOfTokenHolder[_from] -= _value;
    balanceOfTokenHolder[_to] += _value;
    emit Transfer(_from, _to, _value);
    return true;
  }

  /**
  * @notice Read how many tokens an address has
  * @param _owner address to check balance of
  * @return balance, in wei
  */
  function balanceOf(address _owner) external view returns (uint256 balance) {
    return balanceOfTokenHolder[_owner];
  }

  /**
  * @notice Check the remaining amount _spender is still allowed to withdraw from _owner
  * @param _owner controller of the allowed tokens
  * @param _spender authorized allowee
  * @return balance, in wei
  */
  function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
    return approvers[_owner][_spender];
  }
}
