const { expect } = require("chai");
const { utils } = require("ethers");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Standart_ERC20", function () {
    it("name() should return name of Token", async function () {
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        expect(await token.name()).to.equal("Doctor");
    });
    it("symbol() should return symbol of Token", async function () {
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        expect(await token.symbol()).to.equal("WHO");
    });
    it("decimals() should return 18", async function () {
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        expect(await token.decimals()).to.equal(18);
    });
    it("totalSupply() should return total supply", async function () {
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        expect(await token.totalSupply()).to.equal(parseUnits("19632017", 18));  
    });
    it("balanceOf() should return balance after transfer() of owner to another address", async function () {
        const [owner, addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        const transferToken = await token.transfer(addr1.address, 100);
        await transferToken.wait();
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });
    it("transfer() should return error, because adrr1 has no tokens", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(owner).deployed();
        await expect(token.connect(addr1).transfer(addr2.address, 100)).to.be.revertedWith("Not enough tokens");
    });
    it("transferFrom() should return error, because addr2 didnt give permission to the add1 ", async function () {
        const [addr1, addr2, addr3] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        await expect(token.connect(addr1).transferFrom(addr2.address, addr3.address, 100)).to.be.revertedWith("Not enough allowed amount");
    });
    it("transferFrom() should return error, because adrr1 has no tokens ", async function () {
        const [addr1, addr2, addr3] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        const getApprove = await token.connect(addr2).approve(addr1.address, 100);
        await getApprove.wait();
        await expect(token.connect(addr1).transferFrom(addr2.address, addr3.address, 100)).to.be.revertedWith("Not enough tokens");
    });
    it("transferFrom() should transfer tokens from addr2 to addr3 ", async function () {
        const [addr1, addr2, addr3] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        const transferToken = await token.transfer(addr2.address, 100);
        await transferToken.wait();
        const getApprove = await token.connect(addr2).approve(addr1.address, 100);
        await getApprove.wait();
        const transferFromToken = await token.connect(addr1).transferFrom(addr2.address, addr3.address, 100);
        await transferFromToken.wait();
        expect(await token.balanceOf(addr3.address)).to.equal(100);
    });
    it("allowance() should return allowed amount", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        const getApprove = await token.connect(addr2).approve(addr1.address, 100);
        await getApprove.wait();
        expect(await token.allowance(addr2.address, addr1.address)).to.equal(100);
    });
    it("burn() should burn token fron totalSupply", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        const burnToken = await token.connect(addr1).burn(addr1.address, parseUnits("19632017", 18));
        await burnToken.wait();
        expect(await token.totalSupply()).to.equal(0);
    });
    it("burn() should burn token fron owner address", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        const burnToken = await token.connect(addr1).burn(addr1.address, parseUnits("19632017", 18));
        await burnToken.wait();
        expect(await token.balanceOf(addr1.address)).to.equal(0);
    });
    it("burn() should return error, because client isnt owner", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr2).burn(addr1.address, parseUnits("19632017", 18))).to.be.revertedWith("Not owner");
    });
    it("burn() should return error, because not enough tokens", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr1).burn(addr1.address, parseUnits("19632018", 18))).to.be.revertedWith("Not enough tokens");
    });
    it("mint() should mint token fron totalSupply", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        const mintToken = await token.connect(addr1).mint(addr1.address, parseUnits("3", 18));
        await mintToken.wait();
        expect(await token.totalSupply()).to.equal(parseUnits("19632020"));
    });
    it("mint() should mint token fron owner address", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        const mintToken = await token.connect(addr1).mint(addr1.address, parseUnits("3", 18));
        await mintToken.wait();
        expect(await token.balanceOf(addr1.address)).to.equal(parseUnits("19632020", 18));
    });
    it("mint() should return error, because client isnt owner", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr2).mint(addr1.address, parseUnits("19632017", 18))).to.be.revertedWith("Not owner");
    });
    it("transfer() should return error, because recipient has zero address", async function () {
        const [owner] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(owner).deployed();
        await expect(token.connect(owner).transfer(ethers.constants.AddressZero, 100)).to.be.revertedWith("Transfer to the zero address");
    });
    it("transferFrom() should return error, because the transfer is made from the zero address ", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        await expect(token.connect(addr1).transferFrom(ethers.constants.AddressZero, addr2.address, 100)).to.be.revertedWith("Transfer from the zero address");
    });
    it("transferFrom() should return error, because recipient has zero address ", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        await expect(token.connect(addr1).transferFrom(addr2.address, ethers.constants.AddressZero, 100)).to.be.revertedWith("Transfer to the zero address");
    });
    it("approve() should return error, because spender has zero address", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.deployed();
        await expect(token.connect(addr1).approve(ethers.constants.AddressZero, 100)).to.be.revertedWith("Approve to the zero address");
    });
    it("burn() should return error, because client has zero address", async function () {
        const [addr1] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr1).burn(ethers.constants.AddressZero, parseUnits("19632017", 18))).to.be.revertedWith("Burn from the zero address");
    });
    it("mint() should return error, because client has zero address", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr1).mint(ethers.constants.AddressZero, parseUnits("19632017", 18))).to.be.revertedWith("Mint to the zero address");
    });
    it("transferOwnership() should return error, because new owner has zero address", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        await expect(token.connect(addr1).transferOwnership(ethers.constants.AddressZero)).to.be.revertedWith("New owner have the zero address");
    });
    it("transferOwnership() should return error, because client not owner", async function () {
        const [addr1, addr2] = await ethers.getSigners();
        const ERC20 = await ethers.getContractFactory("Standart_ERC20");
        const token = await ERC20.deploy("Doctor", "WHO", 18);
        await token.connect(addr1).deployed();
        const transferOwner = await token.connect(addr1).transferOwnership(addr2.address);
        await transferOwner.wait();
        await expect(token.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWith("Not owner");
    });
});