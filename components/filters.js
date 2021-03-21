import React from 'react';
import ReactDOM from 'react-dom';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function CustomToggle ({ children, eventKey }) {
    // const decoratedOnClick = useAccordionToggle(eventKey, () =>
        // save for later
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

    popover = (
        <Popover>
            <Popover.Content style={{color: 'white'}}>
                Minimum 20 Seconds
            </Popover.Content>
        </Popover>
    )

  constructor(props) {
    super(props);

    
  }

  handleCourseFilter = (e) => {
    // console.log('filters.js, handleCourseFilter e: ', e.target.value)
    // this.props.onFilterQueue(ReactDOM.findDOMNode(this.refs.courseFilter).value);
    this.props.onFilterQueue(e.target.value);
  }

  handleRefreshChange = (e) => {
    // console.log('filters.js, handleRefreshChange e: ', e.target.value)
    // this.props.onRefreshChange(ReactDOM.findDOMNode(this.refs.refreshInput).value);
    this.props.onRefreshChange(e.target.value);
  }

  handleRefreshCheckedChange = (e) => {
    // console.log('filters.js, handleRefreshCheckedChange e: ', e.target.checked)
    this.props.onRefreshCheckedChange(e.target.checked);
  }

  // TODO: set statuses for getting courses, getting submissions, num of submissions
  render() {
    return(
        <Accordion className='mb-3 mt-3'>
            <Card text='white' bg='dark'>
                <CustomToggle eventKey='0'>
                    <Container fluid='lg'>
                        <Row onClick={ () => this.props.onOptionsToggle() }>
                            <Col>
                                {/* Filtering:*/}
                            </Col>
                            <Col className='text-right'>
                                Options
                                { this.props.viewOptions ? <CaretUpFill className='ml-2' /> : <CaretDownFill className='ml-2' /> }
                            </Col>
                        </Row>
                    </Container>
                </CustomToggle>
                <Accordion.Collapse eventKey='0'>
                    <Card.Body>
                        <Container fluid='lg'>
                            <Row>
                                <Col>
                                    <label>Filter Course Name</label>
                                    <InputGroup size='sm'>
                                        <FormControl
                                            ref='courseFilter'
                                            onChange={ this.handleCourseFilter } />
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <label>Auto-Refresh</label>
                                    <InputGroup size='sm'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox 
                                                checked={ this.props.autoRefresh }
                                                onChange={ this.handleRefreshCheckedChange }/>
                                        </InputGroup.Prepend>
                                        <OverlayTrigger trigger='focus' placement='top' overlay={ this.popover }>
                                            <FormControl 
                                                placeholder={ this.props.refreshValue }
                                                ref='refreshInput'
                                                onChange={ this.handleRefreshChange } />
                                        </OverlayTrigger>
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