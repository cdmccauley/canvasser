import React from 'react';

import Navbar from 'react-bootstrap/Navbar'

import { PersonCircle } from 'react-bootstrap-icons'

export default class Nav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Navbar bg="secondary" variant="dark">
        <Navbar.Brand>Canvasser</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <PersonCircle size={ 32 }/>
        </Navbar.Collapse>
      </Navbar>
    )
  }

}