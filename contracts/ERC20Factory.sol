pragma solidity >=0.5.0 <0.7.0;

import "./MyERC20.sol";

contract ERC20Factory {
    // owner address to array of token addresses they own
    mapping(address => address[]) public tokenHolders;
    // token address to supply, name, symbol, and decimals
    struct TokenInfo {
        uint supply;
        string name;
        string symbol;
        uint8 decimals;
    }
    mapping(address => TokenInfo) tokenInfoList;

    function createToken(uint _initalSupply, string memory _name, string memory _symbol, uint8 _decimals)
    public returns (address) {
        MyERC20 token = new MyERC20(_initalSupply, _name, _symbol, _decimals);
        tokenHolders[msg.sender].push(address(token));
        //the factory will own the created tokens. You must transfer them.
        token.transfer(msg.sender, _initalSupply);

        address tokenAddress = address(token);
        tokenInfoList[tokenAddress].supply = _initalSupply;
        tokenInfoList[tokenAddress].name = _name;
        tokenInfoList[tokenAddress].symbol = _symbol;
        tokenInfoList[tokenAddress].decimals = _decimals;
        return address(token);
    }

    /* * *
    *
    * functions created for use with a web app client
    *
    *
    * * * */

    function getCount() public view returns (uint) {
        return tokenHolders[msg.sender].length;
    }

    // given a token address, return the crucial information
    function getTokenInfo(address a) public view returns (uint, string memory, string memory, uint8 ) {
        TokenInfo memory t = tokenInfoList[a];
        return (
            t.supply,
            t.name,
            t.symbol,
            t.decimals
        );
    }
}