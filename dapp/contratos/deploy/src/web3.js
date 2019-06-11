const Web3 = require('web3')
const env = require('./loadEnv')

const {
  DEPLOYMENT_ACCOUNT_PRIVATE_KEY,
  GAS_LIMIT,
  GAS_PRICE,
  GET_RECEIPT_INTERVAL_IN_MILLISECONDS,
  RPC_URL
} = env

const provider = new Web3.providers.HttpProvider(RPC_URL)
const web3 = new Web3(provider)

const deploymentPrivateKey = Buffer.from(DEPLOYMENT_ACCOUNT_PRIVATE_KEY, 'hex')

module.exports = {
  web3,
  deploymentPrivateKey,
  RPC_URL,
  GAS_LIMIT,
  GAS_PRICE,
  GET_RECEIPT_INTERVAL_IN_MILLISECONDS
}
