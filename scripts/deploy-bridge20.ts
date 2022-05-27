const hre = require("hardhat");
import config from '../config'
import { ethers, network, run } from 'hardhat'
import { parseEther, parseUnits } from "ethers/lib/utils";

function sleep() {
    return new Promise(
        resolve => setTimeout(resolve, 40000)
    );
}

async function main() {
  
    const { ERC20_ADDRESS, CHAIN_ID} = config[network.name]
    const Contract = await hre.ethers.getContractFactory("Bridge_ERC20");
    const contract = await Contract.deploy(ERC20_ADDRESS, CHAIN_ID);
    await contract.deployed();
    console.log("Bridge_ERC20 deployed to:", contract.address);

    await sleep();

    console.log('Bridge_ERC20 verify vesting...');


    try {
        await run('verify:verify', {
            address: contract.address,
            constructorArguments: [
                ERC20_ADDRESS,
                CHAIN_ID
                ],
                contract: "contracts/BridgeERC20.sol:Bridge_ERC20"
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