// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract Contract {

 struct hashes {
  string ipfsFaceHash;
  string ipfsSigHash;
  bool doesItExist;
 }

 mapping(uint => hashes) templates; 
 
 function sendHashes(uint ssn, string memory faceHash, string memory sigHash) public {
   if(!verifyHashes(ssn, faceHash, sigHash)){
     templates[ssn] = hashes(faceHash, sigHash, true);
   }
 }

 function getHashes(uint ssn) public view returns (string memory faceHash, string memory sigHash) {
   if(templates[ssn].doesItExist == true){
     return (templates[ssn].ipfsFaceHash, templates[ssn].ipfsSigHash);
   }
   return ("0", "0");
 }

 function verifyHashes(uint ssn, string memory faceHash, string memory sigHash) public view returns (bool decision) {
   if (
     templates[ssn].doesItExist == true &&
     keccak256(bytes (templates[ssn].ipfsFaceHash)) == keccak256(bytes (faceHash)) &&
     keccak256(bytes (templates[ssn].ipfsSigHash)) == keccak256(bytes (sigHash))
    ) {
      return true;
    }
   return false;
 }
}