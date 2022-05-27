//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "./ERC721.sol";
import "./ERC721TokenHolder.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Bridge_ERC721 is ERC721TokenHolder {
    using ECDSA for bytes32;
    address owner;
    address bridge;
    uint256 public chainId;
    address public ERC721Token;
    mapping (bytes32 => status) swaps;
    enum status { EMPTY, SWAPED, REDEEMED }
    

    constructor(address _ERC721Address, uint256 _chainId) {
        owner = msg.sender;
        ERC721Token = _ERC721Address;
        chainId = _chainId;
    }

    event swapInitialized(uint256 _itemId, address _owner, uint256 _chainIDfrom, uint256 _chainIDto);
    event tokenRedeemed(uint256 _itemId, address _owner, uint256 _chainIDfrom, uint256 _chainIDto);

    function swap(
        uint256 _itemId, 
        uint256 _chainIdTo, 
        uint256 _nonce
    ) external {
        require(Standart_ERC721(ERC721Token).ownerOf(_itemId) == msg.sender, "User has no rights to this token");
        bytes32 dataHash = keccak256(
            abi.encodePacked(_itemId, msg.sender, _nonce, chainId, _chainIdTo)
        );
        swaps[dataHash] = status.SWAPED;
        Standart_ERC721(ERC721Token).burn(_itemId);
        emit swapInitialized(_itemId, msg.sender, chainId, _chainIdTo);
    }

    function redeem(
        uint256 _itemId,
        address _owner, 
        uint256 _chainIdFrom, 
        uint256 _nonce,
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s
    ) external {
        require(msg.sender == bridge, "Caller is not owner of bridge");

        bytes32 dataHash = keccak256(
            abi.encodePacked(_itemId, _owner, _nonce, _chainIdFrom, chainId)
        );
        address signer = ECDSA.recover(dataHash.toEthSignedMessageHash(), _v, _r, _s);
        require(signer == msg.sender, "Signature is wrong");
        require(swaps[dataHash] != status.REDEEMED, "Already Redeemed");
        swaps[dataHash] = status.REDEEMED;
        Standart_ERC721(ERC721Token).mint(_owner, _itemId);
    }

    function setChairePerson(address _newChairPerson) public {
        require(msg.sender == owner, "Caller is not owner of bridge");
        bridge = _newChairPerson;
    }

    
}
