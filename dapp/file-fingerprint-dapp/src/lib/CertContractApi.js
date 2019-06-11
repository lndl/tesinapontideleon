import Web3       from 'web3';
import config     from '../config.js'
import contract   from '../contracts/NotarizedFiles.json';
import abiDecoder from '../vendor/abiDecoder.js';

const CertContractApi = (() => {
  abiDecoder.addABI(contract.abi);

  const getWeb3Instance = (mode = 'read') => {
    let web3;
    if (typeof window.web3 !== 'undefined' && mode === 'write') {
      web3 = new Web3(window.web3.currentProvider);
      //FIXME: Ugly hack!
      web3.eth.defaultAccount = window.web3.eth.defaultAccount
    } else {
      // Set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.WebsocketProvider(config.ethereum.host));
    }

    return web3
  }


  const getContractInstance = (connection) => {
    return new connection.eth.Contract(contract.abi, config.ethereum.contract.address);
  }

  const getPastEvents = (event, options) => {
    let options2 = Object.assign({ fromBlock: 0 }, options)
    const web3Conn = getWeb3Instance('read')
    const contract = getContractInstance(web3Conn)
    return contract.getPastEvents(event, options2)
  }

  return {
    addFile: (...args) => {
      const web3Conn = getWeb3Instance('write')
      const contract = getContractInstance(web3Conn)
      const tx = contract.methods.addFile(...args)
      return tx.send({ from: web3Conn.eth.defaultAccount })
    },
    once: (event, callback) => {
      const web3Conn = getWeb3Instance('read')
      const contract = getContractInstance(web3Conn)
      return contract.once(event, callback)
    },
    getPastEvents: getPastEvents,
    getTransactions: async (txType) => {
      const web3Conn = getWeb3Instance('read')

      const events = await getPastEvents(txType)
      const transactions = await Promise.all(events.map(async (event) => {
        const transaction = await web3Conn.eth.getTransaction(event.transactionHash)
        const block       = await web3Conn.eth.getBlock(transaction.blockHash)
        const txData      = await abiDecoder.decodeMethod(transaction.input)
        return { transaction, block, txData }
      }))

      return transactions
    }
  }
})()

export default CertContractApi;
