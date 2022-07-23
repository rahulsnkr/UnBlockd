// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract Contract {

 struct hashes {
  string ipfsFaceHash;
  string ipfsSigHash;
  bool doesItExist;
 }

 mapping(bytes32 => hashes) templates; 
 
 function sendHashes(string memory ssn, string memory faceHash, string memory sigHash) public {
   if(!verifyHashes(ssn, faceHash, sigHash)){
     templates[keccak256(abi.encodePacked(ssn))] = hashes(faceHash, sigHash, true);
   }
 }

 function getHashes(string memory ssn) public view returns (string memory faceHash, string memory sigHash) {
   if(templates[keccak256(abi.encodePacked(ssn))].doesItExist == true){
     return (templates[keccak256(abi.encodePacked(ssn))].ipfsFaceHash, templates[keccak256(abi.encodePacked(ssn))].ipfsSigHash);
   }
   return ("0", "0");
 }

 function verifyHashes(string memory ssn, string memory faceHash, string memory sigHash) public view returns (bool decision) {
   if (
     templates[keccak256(abi.encodePacked(ssn))].doesItExist == true &&
     keccak256(bytes (templates[keccak256(abi.encodePacked(ssn))].ipfsFaceHash)) == keccak256(bytes (faceHash)) &&
     keccak256(bytes (templates[keccak256(abi.encodePacked(ssn))].ipfsSigHash)) == keccak256(bytes (sigHash))
    ) {
      return true;
    }
   return false;
 }
}