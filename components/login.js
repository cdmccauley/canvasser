import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import Form from 'react-bootstrap/Form'

import { PersonFill, ShieldLockFill } from 'react-bootstrap-icons';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.onLoginClick(ReactDOM.findDOMNode(this.refs.modalUsername).value.trim(), ReactDOM.findDOMNode(this.refs.modalPassword).value.trim())
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log('username:', e.target[0].value, 'password:', e.target[1].value)
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
            <Modal.Title>Canvasser Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <label htmlFor="modalUsername">Canvasser Username</label>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text><PersonFill /></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                ref='modalUsername'
                id='modalUsername'
              />
            </InputGroup>
            <label htmlFor="modalPassword">Canvasser Password</label>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text><ShieldLockFill /></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                ref='modalPassword'
                id='modalPassword'
              />
            </InputGroup> */}
            <Form onSubmit={ this.handleSubmit }>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button 
              variant='primary' onClick={ this.handleClick }>
              Login
            </Button>
          </Modal.Footer> */}
        </Modal>
      </React.Fragment>
    )
  }

}