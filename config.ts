// import BigNumber from 'bignumber.js'
// BigNumber.config({ EXPONENTIAL_AT: 60 })
import { parseEther, parseUnits } from "ethers/lib/utils";



export default {
	
    bsctestnet: {
		ERC20_ADDRESS: "",
        BRIDGE20_ADDRESS: "",

		CHAIN_ID: 97,

		ERC721_ADDRESS: "",
        BRIDGE721_ADDRESS: "",
	},

	rinkeby: {
		ERC20_ADDRESS: "0x79bF56105013B10E9dDC83663e23f6501a7256D7",
        BRIDGE20_ADDRESS: "0xc9d397c5e43C00294324dfeB44EFbBc42Ab69922",

		CHAIN_ID: 4,

		ERC721_ADDRESS: "0x5D100fdc287256FF442d6bEE4a3a9A18DF1df4D6",
        BRIDGE721_ADDRESS: "0x119569d7FE9D18Bb2055E0bcf079b67EC85c199A",
	},

	bsc: { //bsctestnet
		ERC20_ADDRESS: "0x847faAb0E6a9fF27171D994CF945BB4A4EbdCCAA",
        BRIDGE20_ADDRESS: "0xe82e785Fc77c7365B50CfDcbec30d32768B647C2",

		CHAIN_ID: 56,

		ERC721_ADDRESS: "0x0d2c041AcB56A36334fD15727279fbB287de3a14",
        BRIDGE721_ADDRESS: "0x3449918631a764626Cb7Cca0852072FAa8699Eb2",
	},

	mainnet: {
		ERC20_ADDRESS: "",
        BRIDGE20_ADDRESS: "",

		CHAIN_ID: 1,

		ERC721_ADDRESS: "",
        BRIDGE721_ADDRESS: "",
	}
} as { [keys: string]: any }