// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.1;

import "./interfaces/ERC721TokenReceiver.sol";

contract ERC721TokenHolder is ERC721TokenReceiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}