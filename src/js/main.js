require("dotenv").config();

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    App.initWeb3();
    App.initContract();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
    // If no injected web3 instance is detected, fall back to Ganache
      //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/' + process.env.INFURA_APIKEY);
    }
    web3 = new Web3(App.web3Provider);
  },

  initContract: function() {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var GraCoinCrowdsaleArtifact = process.env.GRACOINCROWDSALE;
      App.contracts.GraCoinCrowdsale = TruffleContract(GraCoinCrowdsaleArtifact);

      // Set the provider for our contract
      App.contracts.GraCoinCrowdsale.setProvider(App.web3Provider);
      return App.loadView();
  },

  loadView: function() {
    App.contracts.GraCoinCrowdsale.deployed().then(function (instance) {
      return instance.getOpeningTime.call();

    }).then(function(message) {
      var opening = new Date(parseInt(message) * 1000);
      var current = new Date();

      if (opening > current) {
        var hour  = opening.getHours();
        var min   = opening.getMinutes();
        var date  = opening.getDate();
        var month = opening.getMonth() + 1;
        var year  = opening.getFullYear();

        $('#time').text(hour + ':' + min + ' ' + date + '/' + month + '/' + year);

      } else {
        window.location.href = "ico.html";
      }      

    }).catch(function(err) {
      $('#message').text(err.message);
      console.log(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();

    setInterval(function(){
      App.loadView();
    }, 1000);
  });
});
