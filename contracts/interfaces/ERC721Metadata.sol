// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.1;

import "./IERC721.sol";

interface ERC721Metadata is IERC721 {
    function name() external view returns (string memory _name);

    function symbol() external view returns (string memory _symbol);

    function tokenURI(uint256 _tokenId) external view returns (string memory);
}