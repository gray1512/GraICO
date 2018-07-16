pragma solidity ^0.4.23;

import './GraCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';


contract GraCoinCrowdsale is TimedCrowdsale, MintedCrowdsale {
    constructor (
            uint256 _openingTime,
            uint256 _closingTime,
            uint256 _rate,
            address _wallet,
            MintableToken _token
    ) public
        Crowdsale(_rate, _wallet, _token)
        TimedCrowdsale(_openingTime, _closingTime) {
    }

    function getOpeningTime() public view returns (uint256) {
        return openingTime;
    }

    function getClosingTime() public view returns (uint256) {
        return closingTime;
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function getWeiRaised() public view returns (uint256) {
        return weiRaised;
    }
}