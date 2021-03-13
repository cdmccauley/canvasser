import React from 'react';

import Navbar from 'react-bootstrap/Navbar'
import Image from 'react-bootstrap/Image'
import Dropdown from 'react-bootstrap/Dropdown'

import { PersonCircle } from 'react-bootstrap-icons'
import { DropdownButton } from 'react-bootstrap';

export default class Nav extends React.Component {

  constructor(props) {
    super(props);
  }

  ImageDropdown = () => {
    return(
      <Image style={{width: '32px', height: '32px'}} src={ this.props.avatarUrl } roundedCircle />
    )
  }

  PersonCircleDropdown = () => {
    return(
      <PersonCircle size={ 32 }/>
    )
  }

  render() {
    return(
      <Navbar bg="secondary" variant="dark">
        <Navbar.Brand>Canvasser</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown drop={ 'left' }>
            <Dropdown.Toggle variant='secondary'>
              { this.props.loggedIn ? 
              <Image style={{width: '32px', height: '32px'}} src={ this.props.avatarUrl } roundedCircle /> : 
              <PersonCircle size={ 32 }/> }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="1" onClick={ this.props.onLoginToggle}>{ this.props.loggedIn ? 'Logout' : 'Login' }</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
    )
  }

}