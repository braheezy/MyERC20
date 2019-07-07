pragma solidity >=0.5.0 <0.7.0;

import "./MyERC20.sol";

contract ERC20Factory {
    mapping(address => address[]) public tokenHolders;
    mapping(address => int) public tokenCount;

    function createToken(uint _initalSupply, string memory _name, string memory _symbol, uint8 _decimals)
    public returns (address) {
        MyERC20 token = new MyERC20(_initalSupply, _name, _symbol, _decimals);
        tokenHolders[msg.sender].push(address(token));
        tokenCount[msg.sender]++;
        //the factory will own the created tokens. You must transfer them.
        token.transfer(msg.sender, _initalSupply);
        return address(token);
    }

    // for use with a web app client
    function updateCount(int _newCount) public {
        require(tokenCount[msg.sender] > 0,
        "this account hasn't made a token yet");
        tokenCount[msg.sender] = _newCount;
    }
}