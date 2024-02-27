declare const abi: [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_lootAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "lootAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "multMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_lootTokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_userTokenId",
        "type": "uint256"
      }
    ],
    "name": "multRevealNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "userAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; export default abi;
