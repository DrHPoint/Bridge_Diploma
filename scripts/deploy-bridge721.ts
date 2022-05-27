const hre = require("hardhat");
import config from '../config'
import { ethers, network, run } from 'hardhat'
// import { parseEther, parseUnits } from "ethers/lib/utils";

function sleep() {
    return new Promise(
        resolve => setTimeout(resolve, 40000)
    );
}

async function main() {
  
    const { ERC721_ADDRESS, CHAIN_ID} = config[network.name]
    const Contract = await hre.ethers.getContractFactory("Bridge_ERC721");
    const contract = await Contract.deploy(ERC721_ADDRESS, CHAIN_ID);
    await contract.deployed();
    console.log("Bridge_ERC721 deployed to:", contract.address);

    await sleep();

    console.log('Bridge_ERC721 verify vesting...');


    try {
        await run('verify:verify', {
            address: contract.address,
            constructorArguments: [
                ERC721_ADDRESS,
                CHAIN_ID
                ],
                contract: "contracts/BridgeERC721.sol:Bridge_ERC721"
            });
        } catch (e: any) {
            console.log(e.message)
        }
    console.log('verify success') 
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });