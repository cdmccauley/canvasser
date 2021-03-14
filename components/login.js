import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { Globe2, KeyFill } from 'react-bootstrap-icons';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  handleLogin = () => {
    this.props.onLoginSubmit(ReactDOM.findDOMNode(this.refs.modalCanvasUrl).value.trim(), ReactDOM.findDOMNode(this.refs.modalApiKey).value.trim())
  }

  render() {
    return(
      <React.Fragment>
        <Modal
          show={ !this.props.loggedIn }
          backdrop='static'
          centered
        >
          <Modal.Header>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="modalCanvasUrl">Canvas URL</label>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text><Globe2 /></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                ref='modalCanvasUrl'
                id='modalCanvasUrl'
                placeholder='https://davistech.instructure.com'
                aria-label='Canvas URL'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
            <label htmlFor="modalApiKey">API Key</label>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text><KeyFill /></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                ref='modalApiKey'
                id='modalApiKey'
                aria-label='API Key'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant='primary' onClick={ this.handleLogin }>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }

}