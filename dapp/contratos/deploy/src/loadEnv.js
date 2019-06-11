const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
})

const { isAddress, toBN } = require('web3-utils')
const envalid = require('envalid')

// Validations and constants
const bigNumValidator = envalid.makeValidator(x => toBN(x))
const validateAddress = address => {
  if (isAddress(address)) {
    return address
  }

  throw new Error(`Invalid address: ${address}`)
}
const addressValidator = envalid.makeValidator(validateAddress)
const addressesValidator = envalid.makeValidator(addresses => {
  addresses.split(' ').forEach(validateAddress)
  return addresses
})

let validations = {
  DEPLOYMENT_ACCOUNT_PRIVATE_KEY: envalid.str(),
  GAS_LIMIT: bigNumValidator(),
  GAS_PRICE: bigNumValidator(),
  GET_RECEIPT_INTERVAL_IN_MILLISECONDS: bigNumValidator(),
  RPC_URL: envalid.str()
}

const env = envalid.cleanEnv(process.env, validations)

module.exports = env
