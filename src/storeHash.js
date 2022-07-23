import web3 from './web3';
// access our local copy to contract deployed on rinkeby testnet
// use your own contract address
const address = '0x657ab695733ED5C14345BbA0190ED162F1FDF13C';
// use the ABI from your contract
const abi = [
  {
    'inputs': [
      {
        'internalType': 'string',
        'name': 'ssn',
        'type': 'string',
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
        'internalType': 'string',
        'name': 'ssn',
        'type': 'string',
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
        'internalType': 'string',
        'name': 'ssn',
        'type': 'string',
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
