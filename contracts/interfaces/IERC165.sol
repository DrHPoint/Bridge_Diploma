//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

interface IERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}