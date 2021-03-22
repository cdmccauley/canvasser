import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { Globe2, KeyFill } from 'react-bootstrap-icons';

export default class Authorize extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.onAuthorizeClick(ReactDOM.findDOMNode(this.refs.modalCanvasUrl).value.trim(), ReactDOM.findDOMNode(this.refs.modalApiKey).value.trim())
  }

  render() {
    return(
      <React.Fragment>
        <Modal
          show={ !this.props.authorized && this.props.loggedIn }
          backdrop='static'
          centered
        >
          <Modal.Header>
            <Modal.Title>Authorize</Modal.Title>
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
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant='primary' onClick={ this.handleClick }>
              Authorize
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }

}