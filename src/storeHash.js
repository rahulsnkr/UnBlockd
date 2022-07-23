import web3 from './web3';
// access our local copy to contract deployed on rinkeby testnet
// use your own contract address
const address = '0x5276d1bda51D591F4AFE1108308D3c14BCC61427';
// use the ABI from your contract
const abi = [
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'ssn',
        'type': 'uint256',
      },
    ],
    'name': 'getHashes',
    'outputs': [
      {
        'internalType': 'string',
        'name': 'faceHash',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'sigHash',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'ssn',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': 'faceHash',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'sigHash',
        'type': 'string',
      },
    ],
    'name': 'sendHashes',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'ssn',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': 'faceHash',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'sigHash',
        'type': 'string',
      },
    ],
    'name': 'verifyHashes',
    'outputs': [
      {
        'internalType': 'bool',
        'name': 'decision',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
];
export default new web3.eth.Contract(abi, address);
