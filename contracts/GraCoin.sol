pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract GraCoin is MintableToken {
    string public name = "GRA COIN";
    string public symbol = "GRA";
    uint8 public decimals = 18;
}