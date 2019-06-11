const fs = require('fs')
const path = require('path')
const Web3Utils = require('web3-utils')
const { deployContract, privateKeyToAddress } = require('./src/deploymentUtils')
const { web3 } = require('./src/web3')
const { DEPLOYMENT_ACCOUNT_PRIVATE_KEY } = require('./src/loadEnv')
const DEPLOYMENT_ACCOUNT_ADDRESS = privateKeyToAddress(DEPLOYMENT_ACCOUNT_PRIVATE_KEY)
const NotarizedFiles = require('../build/contracts/NotarizedFiles.json')
const deployResultsPath = path.join(__dirname, './deployResults.json')

async function main() {
  console.log('========================================')
  console.log('Desplegando el contrato')
  console.log('========================================\n')
  let nonce = await web3.eth.getTransactionCount(DEPLOYMENT_ACCOUNT_ADDRESS)
  const notarizedFiles = await deployContract(NotarizedFiles, [], {
    from: DEPLOYMENT_ACCOUNT_ADDRESS,
    nonce
  })
  const results = {
      address: notarizedFiles.options.address,
      deployedBlockNumber: Web3Utils.hexToNumber(notarizedFiles.deployedBlockNumber),
      deployedTx: notarizedFiles.transactionHash
  }
  console.log('\nEl despliegue se completo correctamente.\n\n')
  console.log(`[+] Direccion del contrato: ${results.address}`)
  console.log(`[+] Bloque numero: ${results.deployedBlockNumber}`)
  fs.writeFileSync(
    deployResultsPath,
    JSON.stringify(
      {
        contractDetails: {
          ...results
        }
      },
      null,
      4
    )
  )
  console.log(
    '\nLa direccion del contrato se guardo en el archivo `deployResults.json`'
  )
}

main().catch(e => console.log('Error: ', e))
