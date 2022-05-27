//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/ERC721Metadata.sol";
import "./interfaces/ERC721TokenReceiver.sol";
import "./interfaces/IERC721.sol";
import "./ERC165.sol";

contract Standart_ERC721 is ERC165, IERC721, ERC721Metadata {

    using Address for address;
    
    string private _name;
    string private _symbol;
    address public owner;
    address public bridge;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event OwnershipTransferred(address _oldOwner, address _newOwner);
    
    ///@dev modifier to check for owner and bridge addresses
    modifier onlyForOwnerAndBridge () {
        require(((msg.sender == owner) || (msg.sender == bridge)), "Not owner or bridge");
        _;
   }  

    ///@dev modifier to check for owner address
    modifier onlyForOwner () {
        require(msg.sender == owner, "Not owner");
        _;
   } 
   
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return "";
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        require(_owner != address(0), "Error of Zero address");
        return _balances[owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns (address) {
        address owner_ = _owners[_tokenId];
        require(owner_ != address(0), "Error of Zero address");
        return owner_;
    }

    function approve(address _to, uint256 _tokenId) public override {
        address owner_ = ownerOf(_tokenId);
        require(_to != owner_, "Approve to current owner");

        require(
            msg.sender == owner_ || isApprovedForAll(owner_, msg.sender),
            "Caller isn't owner or approved to use all of owner's tokens"
        );

        _tokenApprovals[_tokenId] = _to;
        emit Approval(owner_, _to, _tokenId);
    }

    function getApproved(uint256 tokenId) public view override returns (address) {
        require(_existence(tokenId), "Token with this Id non exist");

        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address _operator, bool _approved) public override {
        require(msg.sender != _operator, "Operator mustn't be a caller");
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view override returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(_isApproved(msg.sender, _tokenId), "Caller is not allowed to transfer");

        _tokenApprovals[_tokenId] = address(0);
        _balances[_from] -= 1;
        _balances[_to] += 1;
        _owners[_tokenId] = _to;

        emit Transfer (_from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public override {
        transferFrom(_from, _to, _tokenId);
        require(_checkOnERC721Received(_from, _to, _tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function mint(address _to, uint256 _tokenId) public onlyForOwnerAndBridge {
        require(_to != address(0), "Mint to the zero address");
        require(!_existence(_tokenId), "Token already minted");

        _balances[_to] += 1;
        _owners[_tokenId] = _to;

        emit Transfer (address(0), _to, _tokenId);
    }

    function burn(uint256 _tokenId) public onlyForOwnerAndBridge {
        address owner_ = ownerOf(_tokenId);

        _tokenApprovals[_tokenId] = address(0);

        _balances[owner_] -= 1;
        delete _owners[_tokenId];

        emit Transfer(owner_, address(0), _tokenId);
    }

    function setBridge(address _bridge) public onlyForOwner {
        bridge = _bridge;
    }

    function transferOwnership(address _newOwner) public onlyForOwner {
        require(_newOwner != address(0), "New owner have the zero address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _existence(uint256 _tokenId) internal view returns (bool) {
        return _owners[_tokenId] != address(0);
    }

    function _isApproved(address _spender, uint256 _tokenId) internal view returns (bool) {
        require(_existence(_tokenId), "token with this Id non-exist");
        address owner_ = ownerOf(_tokenId);
        return (_spender == owner_ || _spender == getApproved(_tokenId) || isApprovedForAll(owner_, _spender));
    }

    function _checkOnERC721Received(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (_to.isContract()) {
            try ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data) returns (bytes4 retval) {
                return retval == ERC721TokenReceiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }


}

