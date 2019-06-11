import React, { Component } from 'react'
import { Table, Icon } from 'semantic-ui-react'

import config from '../config'
import CertContractApi from '../lib/CertContractApi.js';
import { calculateDigestFromResponse } from '../lib/FileDigest.js';

export default class FFList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      blockchainInfo: 'pending',
      txs: [],
      txChanges: {},
    }
    this.calculateDataChanges = this.calculateDataChanges.bind(this)
    this.notarizedHashFromTx = this.notarizedHashFromTx.bind(this)
    this.filePathFromTx = this.filePathFromTx.bind(this)
  }

  componentDidMount() {
    CertContractApi.getTransactions('FileAdded').then(transactions => {
      transactions = transactions.sort((t1, t2) => {
        return (t2.block.timestamp - t1.block.timestamp)
      })
      this.setState({ txs: transactions, blockchainInfo: 'ready' })
      transactions.forEach(this.calculateDataChanges)
    })
  }

  arePendingEvents() {
    return (this.state.blockchainInfo === 'pending')
  }

  notarizedHashFromTx(tx) {
    return tx.txData.params.find(param => param.name === '_notarizedHash').value
  }

  filePathFromTx(tx) {
    return tx.txData.params.find(param => param.name === '_fileUrl').value
  }

  calculateDataChanges(tx) {
    const notarizedHash = this.notarizedHashFromTx(tx)
    const filePath      = this.filePathFromTx(tx)

    fetch(`${config.fileserver.endpoint}/${filePath}`)
      .then(calculateDigestFromResponse)
      .then(digest => {
        if (notarizedHash === `0x${digest}`) {
          this.setState((oldState, props) => {
            return { txChanges: { ...oldState.txChanges, [notarizedHash]: 'unchanged' } }
          })
        } else {
          this.setState((oldState, props) => {
            return { txChanges: { ...oldState.txChanges, [notarizedHash]: 'changed' } }
          })
        }
      })
      .catch(() => {
        this.setState((oldState, props) => {
          return { txChanges: { ...oldState.txChanges, [notarizedHash]: 'notfound' } }
        })
      })
  }

  digestStatus(tx) {
    const notarizedHash = this.notarizedHashFromTx(tx)
    return this.state.txChanges[notarizedHash]
  }

  drawTable() {
    const { txs } = this.state

    const sliceHash    = (hash) => `${hash.slice(0,16)}...`
    const formatDT     = (unix) => (new Date(unix * 1000)).toString()
    const formatTxData = (txData) => `${txData.name}(${txData.params.map(p => `${p.name}: ${p.value}`).join(', ')})`

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Hash de la transacción</Table.HeaderCell>
            <Table.HeaderCell>Hash del Bloque</Table.HeaderCell>
            <Table.HeaderCell>Dirección origen</Table.HeaderCell>
            <Table.HeaderCell>Timestamp</Table.HeaderCell>
            <Table.HeaderCell>Data de la Tx</Table.HeaderCell>
            <Table.HeaderCell>¿Inmutable?</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        { txs.map((tx, i) => {
            return (
              <Table.Row key={i}>
                <Table.Cell>{sliceHash(tx.transaction.hash)}</Table.Cell>
                <Table.Cell>{sliceHash(tx.block.hash)}</Table.Cell>
                <Table.Cell>{sliceHash(tx.transaction.from)}</Table.Cell>
                <Table.Cell>{formatDT(tx.block.timestamp)}</Table.Cell>
                <Table.Cell>{formatTxData(tx.txData)}</Table.Cell>
                <Table.Cell>
                  { (this.digestStatus(tx) === 'unchanged') && <Icon name='check' /> }
                  { (this.digestStatus(tx) === 'changed')   && <Icon name='cancel' /> }
                  { (this.digestStatus(tx) === 'notfound')  && <Icon name='question' /> }
                  { (this.digestStatus(tx) === undefined)   && <Icon name='circle notched' loading /> }
                </Table.Cell>
              </Table.Row>
            )
          })
        }
        </Table.Body>
      </Table>
    )
  }

  render() {
    if (this.arePendingEvents()) {
      return (
        <div>
          <Icon name='circle notched' loading />
          Obteniendo información
        </div>
      )
    } else {
      return this.drawTable()
    }
  }
}
