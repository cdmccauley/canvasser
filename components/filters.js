import React from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function CustomToggle ({ children, eventKey }) {
    // const decoratedOnClick = useAccordionToggle(eventKey, () =>
    //     console.log(children.props.children.props.children),
    // );

    const decoratedOnClick = useAccordionToggle(eventKey);

    return (
        <Card.Header
            style={{backgroundColor: '#32363b'}}
            onClick={decoratedOnClick}>
            { children }
            
        </Card.Header>
    );
}

export default class Filters extends React.Component {

  constructor(props) {
    super(props);
  }

  // TODO: create state variable that will toggle caret
  render() {
    return(
        <Accordion className="mb-3 mt-3">
            <Card text='white' bg='dark'>
                <CustomToggle eventKey="0">
                    <Container fluid='lg'>
                        <Row onClick={ () => this.props.onOptionsToggle() }>
                            <Col>
                                Filtering:
                            </Col>
                            <Col className='text-right'>
                                Options
                                { this.props.viewOptions ? <CaretUpFill className='ml-2' /> : <CaretDownFill className='ml-2' /> }
                            </Col>
                        </Row>
                    </Container>
                </CustomToggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Container fluid='lg'>
                            <Row>
                                <Col>
                                    <label>Filter Course Name</label>
                                    <InputGroup size='sm'>
                                        <FormControl />
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <label>Auto-Refresh</label>
                                    <InputGroup size='sm'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox checked />
                                        </InputGroup.Prepend>
                                        <FormControl placeholder='60'/>
                                        <InputGroup.Append>
                                            <InputGroup.Text>
                                                Seconds
                                            </InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
  }

}

{/* <Accordion.Toggle as={Card.Header} eventKey="0">
                    Click me!
                </Accordion.Toggle> */}