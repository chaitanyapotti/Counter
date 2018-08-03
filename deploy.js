const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const {
    interface,
    bytecode
} = require("./compile");
const {
    interfaceerc,
    bytecodeerc
} = require("./compileerc");

const providerRinkeby = new HDWalletProvider(
    "blue inherit drum enroll amused please camp false estate flash sell right",
    "https://rinkeby.infura.io/v3/dc22c9c6245742069d5fe663bfa8a698"
);

const providerRopsten = new HDWalletProvider(
    "blue inherit drum enroll amused please camp false estate flash sell right",
    "https://ropsten.infura.io/v3/dc22c9c6245742069d5fe663bfa8a698s"
);

//npm install --save web3
//npm install --save truffle-hdwallet-provider

let rinkebyAddress;
let ropstenAddress;

//Rinkeby
const web3Rinkeby = new Web3(providerRinkeby);
//Ropsten
const web3Ropsten = new Web3(providerRopsten);

const deployBoth = async () => {
    rinkebyAddress = await deploy(web3Rinkeby, interface, bytecode);
    ropstenAddress = await deploy(web3Ropsten, interface, bytecode);
}

const deploy = async (web3, iface, bcode) => {
    const accounts = await web3.eth.getAccounts();

    console.log("preparing to deploy from : ", accounts[0]);

    const counter = await new web3.eth.Contract(JSON.parse(iface)).deploy({
        data: "0x" + bcode
    }).send({
        from: accounts[0],
        gas: 1000000
    });

    console.log("Contract in Network is deployed at ", counter.options.address);
    return counter.options.address;
}

deployBoth();