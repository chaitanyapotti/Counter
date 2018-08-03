const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const assert = require("assert");
const {
    interface,
    bytecode
} = require("../compile");
const {
    interfaceerc,
    bytecodeerc
} = require("./compileerc");

const providerRinkeby = new HDWalletProvider(
    "blue inherit drum enroll amused please camp false estate flash sell right",
    "https://rinkeby.infura.io/v3/dc22c9c6245742069d5fe663bfa8a698", 0, 10
);

const providerRopsten = new HDWalletProvider(
    "blue inherit drum enroll amused please camp false estate flash sell right",
    "https://ropsten.infura.io/v3/dc22c9c6245742069d5fe663bfa8a698s", 0, 10
);

//npm install --save web3
//npm install --save truffle-hdwallet-provider

let rinkebyContract;
let rinkebyERCContract;
let ropstenContract;
let ropstenERCContract;
let accountsRinkeby;
let accountsRopsten;

//Rinkeby
const web3Rinkeby = new Web3(providerRinkeby);
//Ropsten
const web3Ropsten = new Web3(providerRopsten);

const deployBoth = async () => {
    accountsRinkeby = await web3Rinkeby.eth.getAccounts();
    console.log(accountsRinkeby[0]);
    //accountsRopsten = await web3Ropsten.eth.getAccounts();
    //console.log(accountsRopsten[0]);
    rinkebyContract = await deploy(web3Rinkeby, interface, bytecode, accountsRinkeby);
    rinkebyERCContract = await deploy(web3Rinkeby, interfaceerc, bytecodeerc, accountsRinkeby);
     
    //ropstenContract =  deploy(web3Ropsten, interface, bytecode, accountsRopsten);
    ropstenContract = await deploy(web3Rinkeby, interface, bytecode, accountsRinkeby);
    ropstenERCContract = await deploy(web3Rinkeby, interfaceerc, bytecodeerc, accountsRinkeby);

};

beforeEach("Counter", async () => {
    await deployBoth();
});

const deploy = async (web3, iface, bcode, accounts) => {
    console.log("preparing to deploy from : ", accounts[0]);

    const counter = await new web3.eth.Contract(JSON.parse(iface)).deploy({
        data: "0x" + bcode
    }).send({
        from: accounts[0],
        gas: 1000000
    });
    console.log("Contract in Network is deployed at ", counter.options.address);
    return counter;
};

describe("Counter tests", () => {
    it("deploys both contracts", () => {
        assert.ok(rinkebyContract.options.address);
        console.log(rinkebyContract.options.address);
        assert.ok(ropstenContract.options.address);
        console.log(ropstenContract.options.address);
        
    });
});