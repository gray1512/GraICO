require('dotenv').config();

const GraCoinCrowdsale = artifacts.require('./GraCoinCrowdsale.sol');
const GraCoin = artifacts.require('./GraCoin.sol');

module.exports = function(deployer, network, accounts) {
    const openingTime = Math.round(new Date(Date.now()).getTime()/1000) + 600000; // 60 secs in the future
    const closingTime = openingTime + 86400 * 20; // 20 days
    const rate = new web3.BigNumber(1000); // 1000 x 1/ 10^18 token units per wei
    const wallet = process.env.WALLET;
    //const wallet = accounts[1];

    return deployer
        .then(() => {
            return deployer.deploy(GraCoin);
        })
        .then(() => {
            return deployer.deploy(
                GraCoinCrowdsale,
                openingTime,
                closingTime,
                rate,
                wallet,
                GraCoin.address
            );
        }).then(() => {
            return GraCoin.at(GraCoin.address);
        })
        .then((inst) => {
            return inst.transferOwnership(GraCoinCrowdsale.address);
        });
};