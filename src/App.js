import React, {Component} from 'react';
import {Button, Form, Table, Container, Tabs, Tab} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storeHash';
import aesjs from 'aes-js';
import {ImageUpload} from './components/ImageUpload';
import {Inference} from './components/Inference';

class App extends Component {
  state = {
    ipfsFaceHash: null,
    ipfsSigHash: null,
    SSN: '',
    faceBuffer: '',
    sigBuffer: '',
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    gasUsed: '',
    txReceipt: '',
    aesKey: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30, 31],
    SSNblockNumber: '',
    SSNtransactionHash: '',
    SSNgasUsed: '',
    SSNtxReceipt: '',
    SSNipfsFaceHash: null,
    SSNipfsSigHash: null,
    faceImg1: null,
    signImg1: null,
    faceImg2: null,
    signImg2: null,
  };

  captureSSN = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const SSN = parseInt(event.target.value, 10);
    this.setState({SSN: SSN});
  }

  captureFile = (isFace) => (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, isFace);
  };

  convertToBuffer = async (reader, isFace) => {
    // file is converted to a buffer for upload to IPFS
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.state.aesKey);
    if (isFace) {
      const faceByteArray = new Uint8Array(reader.result);
      const faceEncrypted = aesCtr.encrypt(faceByteArray);
      const faceBuffer = await Buffer.from(faceEncrypted);
      this.setState({faceBuffer});
    } else {
      const sigByteArray = new Uint8Array(reader.result);
      const sigEncrypted = aesCtr.encrypt(sigByteArray);
      const sigBuffer = await Buffer.from(sigEncrypted);
      console.log(sigBuffer);
      this.setState({sigBuffer});
    }
  };

  onClick = async () => {
    try {
      this.setState({blockNumber: 'waiting..'});
      this.setState({gasUsed: 'waiting...'});

      await web3.eth.getTransactionReceipt(
          this.state.transactionHash, (err, txReceipt) => {
            this.setState({txReceipt});
          });
      await this.setState({blockNumber: this.state.txReceipt.blockNumber});
      await this.setState({gasUsed: this.state.txReceipt.gasUsed});
    } catch (error) {
      console.log(error);
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    // bring in user's metamask account address
    await window.ethereum.request({method: 'eth_requestAccounts'});
    const accounts = await web3.eth.getAccounts();
    console.log('Sending from Metamask account: ' + accounts[0]);
    // obtain contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ethAddress});
    // save document to IPFS,return its hash#, and set hash# to state
    // https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add

    await ipfs.add(this.state.faceBuffer, async (err, ipfsFaceHash) => {
      console.log(err, ipfsFaceHash);
      this.setState({ipfsFaceHash: ipfsFaceHash[0].hash});
      await ipfs.add(this.state.sigBuffer, (err, ipfsSigHash) => {
        console.log(err, ipfsSigHash);
        this.setState({ipfsSigHash: ipfsSigHash[0].hash});
        console.log(this.state.ipfsFaceHash, this.state.ipfsSigHash);
        storehash.methods.sendHashes(
            this.state.SSN,
            this.state.ipfsFaceHash,
            this.state.ipfsSigHash).send({
          from: accounts[0],
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        });
      });
    });
  };

  onSSNSubmit = async (event) => {
    event.preventDefault();
    // bring in user's metamask account address
    await window.ethereum.request({method: 'eth_requestAccounts'});
    const accounts = await web3.eth.getAccounts();
    console.log('Sending from Metamask account: ' + accounts[0]);
    // obtain contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ethAddress});
    // save document to IPFS,return its hash#, and set hash# to state
    // https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add

    storehash.methods.getHashes(this.state.SSN).call({
      from: accounts[0],
    }, (err, res) => {
      console.log(err, res);
      this.setState({SSNipfsFaceHash: res.faceHash});
      this.setState({SSNipfsSigHash: res.sigHash});
      ipfs.files.get(res.faceHash, (err, files) => {
        const aesCtr = new aesjs.ModeOfOperation.ctr(this.state.aesKey);
        const faceDecrypted = aesCtr.decrypt(files[0].content);
        console.log(files[0].content);
        const faceBlob = new Blob( [faceDecrypted], {type: 'image/jpeg'} );
        const faceURL = URL.createObjectURL(faceBlob);
        const faceLink = document.createElement('a');
        faceLink.download = 'face.jpg';
        faceLink.href = faceURL;
        faceLink.click();
        ipfs.files.get(res.sigHash, (err, sigFiles) => {
          const aesCtr = new aesjs.ModeOfOperation.ctr(this.state.aesKey);
          console.log(sigFiles);
          const sigDecrypted = aesCtr.decrypt(sigFiles[0].content);
          const sigBlob = new Blob( [sigDecrypted], {type: 'image/jpeg'} );
          const sigURL = URL.createObjectURL(sigBlob);
          const sigLink = document.createElement('a');
          sigLink.download = 'sign.jpg';
          sigLink.href = sigURL;
          sigLink.click();
        });
      });
    });
  };

  onSSNClick = async () => {
    try {
      this.setState({SSNblockNumber: 'waiting..'});
      this.setState({SSNgasUsed: 'waiting...'});

      await web3.eth.getTransactionReceipt(
          this.state.SSNtransactionHash, (err, SSNtxReceipt) => {
            console.log(err, SSNtxReceipt);
            this.setState({SSNtxReceipt});
          });
      await this.setState(
          {SSNblockNumber: this.state.SSNtxReceipt.blockNumber},
      );
      await this.setState(
          {SSNgasUsed: this.state.SSNtxReceipt.gasUsed},
      );
    } catch (error) {
      console.log(error);
    }
  }

  setFaceCallback = (mode, img) => {
    if (mode === 0) {
      this.setState({faceImg1: img});
    } else {
      this.setState({faceImg2: img});
    }
  }

  setSignCallback = (mode, img) => {
    if (mode === 0) {
      this.setState({signImg1: img});
    } else {
      this.setState({signImg2: img});
    }
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> UnBlockd</h1>
        </header>
        <Tabs
          defaultActiveKey="onboarding"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="onboarding" title="Onboarding">
            <Container>
              <h3> Choose face and signature images to send to IPFS </h3>
              <Form onSubmit={this.onSubmit}>
                SSN &nbsp;
                <input
                  type="text"
                  onChange={this.captureSSN}
                />
                <h5>Select Face Image</h5>
                <input
                  type="file"
                  onChange={this.captureFile(true)}
                />
                <h5>Select signature Image</h5>
                <input
                  type="file"
                  onChange={this.captureFile(false)}
                />
                <Button
                  bsStyle="primary"
                  type="submit">
                    Send it
                </Button>
              </Form>
              <hr />
              <Button onClick={this.onClick}> Get Transaction Receipt </Button>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>IPFS Face Hash # stored on Eth Contract</td>
                    <td>{this.state.ipfsFaceHash}</td>
                  </tr>
                  <tr>
                    <td>IPFS Sign Hash # stored on Eth Contract</td>
                    <td>{this.state.ipfsSigHash}</td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>
                  <tr>
                    <td>Tx Hash # </td>
                    <td>{this.state.transactionHash}</td>
                  </tr>
                  <tr>
                    <td>Block Number # </td>
                    <td>{this.state.blockNumber}</td>
                  </tr>
                  <tr>
                    <td>Gas Used</td>
                    <td>{this.state.gasUsed}</td>
                  </tr>

                </tbody>
              </Table>
            </Container>

            <Container>
              <h3>
                Enter SSN to retrieve face and signature images from IPFS
              </h3>
              <Form onSubmit={this.onSSNSubmit}>
                SSN &nbsp;
                <input
                  type="text"
                  onChange={this.captureSSN}
                />
                <div>
                  <Button
                    bsStyle="primary"
                    type="submit">
                      Send it
                  </Button>
                </div>
              </Form>
              <hr />
              <Button
                onClick={this.onSSNClick}
              >
                Get Transaction Receipt
              </Button>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>IPFS Face Hash # returned by Eth Contract</td>
                    <td>{this.state.SSNipfsFaceHash}</td>
                  </tr>
                  <tr>
                    <td>IPFS Sign Hash # returned by Eth Contract</td>
                    <td>{this.state.SSNipfsSigHash}</td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Tab>
          <Tab eventKey="access" title="Access Control">
            <h5>Select first set of images</h5>
            <ImageUpload
              setFace={this.setFaceCallback}
              setSign={this.setSignCallback}
              mode={0}
            />
            <hr />
            <h5>Select second set of images</h5>
            <ImageUpload
              setFace={this.setFaceCallback}
              setSign={this.setSignCallback}
              mode={1}
            />
            <Inference state={this.state} />
          </Tab>
        </Tabs>
      </div>
    );
  } // render
} // App
export default App;
