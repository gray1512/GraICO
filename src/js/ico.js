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
    //$.getJSON('GraCoinCrowdsale.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var GraCoinCrowdsaleArtifact = process.env.GRACOINCROWDSALE;
      App.contracts.GraCoinCrowdsale = TruffleContract(GraCoinCrowdsaleArtifact);

      // Set the provider for our contract
      App.contracts.GraCoinCrowdsale.setProvider(App.web3Provider);
      return App.loadView();
    }).error(function(jqXhr, textStatus, error) {
      alert("ERROR: " + textStatus + ", " + error);
    //});
  },

  loadView: function() {
    App.contracts.GraCoinCrowdsale.deployed().then(function (instance) {
      return instance.getClosingTime.call();

    }).then(function(message) {
      App.setupTime(message);

    }).catch(function(err) {
      $('#message').text(err.message);
      console.log(err.message);
    });

    App.contracts.GraCoinCrowdsale.deployed().then(function (instance) {
      return instance.getRate.call();

    }).then(function(message) {
      App.setupRate(parseInt(message));

    }).catch(function(err) {
      $('#message').text(err.message);
      console.log(err.message);
    });

    App.contracts.GraCoinCrowdsale.deployed().then(function (instance) {
      return instance.getWeiRaised.call();

    }).then(function(message) {
      App.setupWeiRaised(message);

    }).catch(function(err) {
      $('#message').text(err.message);
      console.log(err.message);
    });
  },

  setupTime: function(time) {
    var closing = new Date(parseInt(time) * 1000);
    var hour  = closing.getHours();
    var min   = closing.getMinutes();
    var date  = closing.getDate();
    var month = closing.getMonth() + 1;
    var year  = closing.getFullYear();

    $('#time').text(hour + ':' + min + ' ' + date + '/' + month + '/' + year);
  },

  setupRate: function(rate) {
    $('#rate').text('1 Wei = ' + rate);
  },

  setupWeiRaised: function(wei) {
    var ether = parseInt(wei) / 1000000000000000000;
    $('#raised').text(ether + ' ETH');
  },

  fund: function() {
    event.preventDefault();

    // Validation
    if ($('#amount').val() <= 0) {
      $('#message').text("Did you forget to enter an amount?");
      return;
    }

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var purchaser = accounts[0];
      App.contracts.GraCoinCrowdsale.deployed().then(function (instance) {
        var amount = $('#amount').val();
        var unit = $('#unit').children(':selected').val();

        console.log(amount);        
        console.log(unit);

        return instance.sendTransaction({ from: purchaser, value: web3.toWei(amount, unit)});

      }).then(function(message) {
         $('#message').text("Fund Successful!");

      }).catch(function(err) {
        if (err.message === 'Error: MetaMask Tx Signature: User denied transaction signature.') {
          $('#message').text("Transaction was rejected");

        } else {
          $('#message').text(err.message);
        }
        
        console.log(err);
      });
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
