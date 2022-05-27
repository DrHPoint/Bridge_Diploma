//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "./ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Bridge_ERC20 {
    using ECDSA for bytes32;
    address owner;
    address bridge;
    uint256 public chainId;
    address public ERC20Token;
    mapping (bytes32 => status) swaps;
    enum status { EMPTY, SWAPED, REDEEMED }
    

    constructor(address _ERC20Address, uint256 _chainId) {
        owner = msg.sender;
        ERC20Token = _ERC20Address;
        chainId = _chainId;
    }

    event swapInitialized(uint256 _amount, address _owner, uint256 _chainIDfrom, uint256 _chainIDto);
    event tokenRedeemed(uint256 _amount, address _owner, uint256 _chainIDfrom, uint256 _chainIDto);

    function swap(
        uint256 _amount, 
        uint256 _chainIdTo, 
        uint256 _nonce
    ) external {
        require(Standart_ERC20(ERC20Token).balanceOf(msg.sender) >= _amount, "User does not have enough tokens"); 
        bytes32 dataHash = keccak256(
            abi.encodePacked(_amount, msg.sender, _nonce, chainId, _chainIdTo)
        );
        swaps[dataHash] = status.SWAPED;
        Standart_ERC20(ERC20Token).burn(msg.sender, _amount);
        emit swapInitialized(_amount, msg.sender, chainId, _chainIdTo);
    }

    function redeem(
        uint256 _amount,
        address _owner, 
        uint256 _chainIdFrom, 
        uint256 _nonce,
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s
    ) external {
        require(msg.sender == bridge, "Caller is not owner of bridge");

        bytes32 dataHash = keccak256(
            abi.encodePacked(_amount, _owner, _nonce, _chainIdFrom, chainId)
        );
        address signer = ECDSA.recover(dataHash.toEthSignedMessageHash(), _v, _r, _s);
        require(signer == msg.sender, "Signature is wrong");
        require(swaps[dataHash] != status.REDEEMED, "Already Redeemed");
        swaps[dataHash] = status.REDEEMED;
        Standart_ERC20(ERC20Token).mint(_owner, _amount);
    }

    function setChairePerson(address _newChairPerson) public {
        require(msg.sender == owner, "Caller is not owner of bridge");
        bridge = _newChairPerson;
    }

    
}
