let async = require('async');
let Web3 = require('web3');


let contract = require('../../build/contracts/NotarizedFiles.json');
let config = require('./config');
let fromBlock = config.contract.fromBlock;
let eventName = config.eventName;

let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.host));
}

let notarizedFiles = new web3.eth.Contract(contract.abi, config.contract.address);

function printEvent(event) {
    console.log('Transaccion: https://kovan.etherscan.io/tx/'+event.transactionHash);
    console.log(
        'Evento: ', event.event,'(notarizedHash:', event.returnValues['notarizedHash']+')\n');
}

function listenEvents() {
    async.waterfall([ callback => {
        notarizedFiles.once(eventName, {
            fromBlock: fromBlock,
            toBlock: 'latest'
        }, (error, event) => {
            printEvent(event);
            listenEvents();
        });
    }]);
}

function main(callback) {
    notarizedFiles.getPastEvents(eventName, {
        fromBlock: fromBlock,
        toBlock: 'latest'
    }).then(async events => {
        for (let i = 0; i < events.length; i++) {
            printEvent(events[i]);
        }
        callback();
    });
}

main(listenEvents);