import React, { Fragment, Component } from 'react'
import { Button, Form, Message, Icon } from 'semantic-ui-react'

import CertContractApi from '../lib/CertContractApi.js';
import config from '../config'
import { calculateDigest } from '../lib/FileDigest.js';

const axios = require('axios');

class FFForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      digest: null,
      txHash: null,
      fileUploadLocalServerStatus: 'none',
      fileUploadEthereumBlockchainStatus: 'none'
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.iconByStatus = this.iconByStatus.bind(this);
  }

  handleSubmit(ev) {
    ev.preventDefault();

    const file  = this.uploadInput.files[0]
    const owner = this.ownerInput.value
    const data  = new FormData();
    data.append('file', file);

    this.setState({ fileUploadLocalServerStatus: 'pending' })
    calculateDigest(file)
      .then(digestFromClient => {
        axios.post(`${config.fileserver.endpoint}/uploads`, data)
          .then((response) => {
            const { digest: digestFromServer, file } = response.data
            if (digestFromServer === digestFromClient) {
              this.setState({ digest: digestFromClient, fileUploadLocalServerStatus: 'done' })
              // Listen to blockchain event
              CertContractApi.once('FileAdded', (error, postData) => {
                if (!error) {
                  console.log(postData)
                  this.setState({ fileUploadEthereumBlockchainStatus: 'done', txHash: postData.transactionHash })
                } else {
                  console.error('Falló algo en la subida a la blockchain de Ethereum')
                }
              })
              // Call the contract
              const prefix = '0x' + digestFromClient
              this.setState({ fileUploadEthereumBlockchainStatus: 'pending' })
              CertContractApi.addFile(prefix, owner, file)
            } else {
              console.warn('¡Cuidado! Los digests entre el cliente y el servidor del archivo subido no coinciden')
            }
          })
          .catch((error) => {
            debugger
          });
      })
  }

  iconByStatus(status) {
    return {
      'none': <Icon name='cancel' />,
      'pending': <Icon name='circle notched' loading />,
      'done': <Icon name='check' />,
    }[status]
  }

  render() {
    let { txHash, digest, fileUploadLocalServerStatus, fileUploadEthereumBlockchainStatus } = this.state

    return (
      <Fragment>
        <Message info>
          <Message.Header>Estados de la transacción</Message.Header>
          <Message.List>
            <Message.Item>
              { this.iconByStatus(fileUploadLocalServerStatus) }
              <span>Archivo subido al servidor local</span>
              { digest &&
                <span className="digest"> SHA-256: {digest} </span> }
            </Message.Item>
            <Message.Item>
              { this.iconByStatus(fileUploadEthereumBlockchainStatus) }
              <span>Archivo subido a la Blockchain de Ethereum</span>
              { txHash &&
                  <span className="tx-info"><a href={`https://kovan.etherscan.io/tx/${txHash}`}>Ver transacción</a></span> }
            </Message.Item>
          </Message.List>
        </Message>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Dueño</label>
            <input required placeholder='Dueño' ref={(ref) => { this.ownerInput = ref } } />
          </Form.Field>
          <Form.Field>
            <label>Archivo a certificar</label>
            <input required type="file" ref={(ref) => { this.uploadInput = ref }} />
          </Form.Field>
          <Button type='submit'>Certificar</Button>
        </Form>
      </Fragment>
    )
  }
}

export default FFForm
