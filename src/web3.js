import Web3 from 'web3';
let web3;
if ((typeof window.ethereum !== 'undefined') ||
    (typeof window.web3 !== 'undefined')) {
  web3 = new Web3(window['ethereum'] || window.web3.currentProvider);
} else {
  // here you could use a different provider, maybe use an infura account
  // or maybe let the user know that they need to install metamask in order
  // to continue
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/...'));
}

export default web3;
