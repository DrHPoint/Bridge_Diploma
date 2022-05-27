const hre = require("hardhat");
import config from '../config'
import { ethers, network, run } from 'hardhat'
import { parseEther, parseUnits } from "ethers/lib/utils";

function sleep() {
    return new Promise(
        resolve => setTimeout(resolve, 20000)
    );
}

async function main() {
  
    const Contract = await hre.ethers.getContractFactory("Standart_ERC721");
    const contract = await Contract.deploy("Doctor", "WHO");
    await contract.deployed();
    console.log("Standart_ERC721 deployed to:", contract.address);

    await sleep();

    console.log('starting verify vesting...');


    try {
        await run('verify:verify', {
            address: contract.address,
            constructorArguments: [
                "Doctor", "WHO"
                ],
                contract: "contracts/ERC721.sol:Standart_ERC721"
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
