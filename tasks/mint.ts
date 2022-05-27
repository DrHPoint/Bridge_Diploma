import { task } from "hardhat/config";
import { parseUnits } from "ethers/lib/utils";
//import { ethers } from "hardhat";
//import { hexConcat } from "@ethersproject/bytes";

task("mint", "Mint token NFT")
.addParam("index", "NFT index")
.setAction(async (taskArgs, hre) => {
  const [addr1, addr2, ...addrs] = await hre.ethers.getSigners();

  const nft = await hre.ethers.getContractAt("NFT", process.env.NFT_ADDR as string);
  await nft.connect(addr1).mint(addr1.address, taskArgs.index);

  console.log('mint task Done!'); 
});