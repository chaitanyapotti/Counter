const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const {
    interface,
    bytecode
} = require("./compile");

const providerRinkeby = new HDWalletProvider(
    "blue inherit drum enroll amused please camp false estate flash sell right",
    "https://rinkeby.infura.io/v3/dc22c9c6245742069d5fe663bfa8a698", 0, 10
);
//npm install --save web3
//npm install --save truffle-hdwallet-provider

let counter;
let accounts;

//Rinkeby
const web3Rinkeby = new Web3(providerRinkeby);

const deploy = async (web3, iface) => {
    accounts = await web3.eth.getAccounts();
    console.log(accounts[1]);

    counter = new web3.eth.Contract(JSON.parse(iface), "0x7ea724bc84eC58957AB9098eD0c5c3c0139E573E");
    await counter.methods.claim("thisiswrong", accounts[0]).send({from: accounts[1]});
    //console.log("Contract in Network is deployed at ", counter);

}

deploy(web3Rinkeby, interface);

