module.exports = {
  networks: {
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  },
  mocha: {
    useColors: true,
    reporter: 'nyan'
  },
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
