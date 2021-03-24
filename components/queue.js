import React from 'react';

import Table from 'react-bootstrap/Table';

import { Circle, DashCircleFill, CheckCircleFill, CheckCircle, XCircle } from 'react-bootstrap-icons';

import styles from './Queue.module.css'

export default class Queue extends React.Component {
  UNRESERVED = 'unreserved';
  UNRESERVED_HOVER = 'unreserved-hover';
  SELF_RESERVED = 'self-reserved';
  SELF_RESERVED_HOVER = 'self-reserved-hover';
  RESERVED = 'other-reserved';

  constructor(props) {
    super(props);
  }

  setStatus = (id, status) => {
    this.props.onSetStatus(id, status)
  }

  handleEnter = (id, classes) => {
    if (!classes.contains(this.RESERVED)) {
      let status;
      if (classes.contains(this.UNRESERVED)) {
        status = this.UNRESERVED_HOVER;
      } else if (classes.contains(this.SELF_RESERVED)) {
        status = this.SELF_RESERVED_HOVER;
      }
      this.setStatus(id, status)
    }
  }

  handleLeave = (id, classes) => {
    if (!classes.contains(this.RESERVED)) {
      let status = '';
      if (classes.contains(this.UNRESERVED_HOVER)) {
        status = this.UNRESERVED;
      } else if (classes.contains(this.SELF_RESERVED_HOVER)) {
        status = this.SELF_RESERVED
      }
      if (!status == '') {
        this.setStatus(id, status)
      }
    }
  }

  handleClick = (id, classes) => {
    if (!classes.contains(this.RESERVED)) {
      classes.contains(this.UNRESERVED_HOVER) ?
      this.setStatus(id, this.SELF_RESERVED) :
      this.setStatus(id, this.UNRESERVED_HOVER)
    } else {
      //TODO: alert or popover
      console.log('submission is reserved')
    }
  }

  getStatusIcon = (id, status) => {
    switch (status) {
      case this.UNRESERVED:
        return <Circle />
      case this.UNRESERVED_HOVER:
        return <CheckCircle />
      case this.SELF_RESERVED:
        return <CheckCircleFill />
      case this.SELF_RESERVED_HOVER:
        return <XCircle />
      case this.RESERVED:
        return <DashCircleFill />
      default:
        return 'e'
    }
  }

  getTr = (submission) => {
    let bg = submission.priority == 1 ? {backgroundColor: '#7c2020'} : {};
    return(
      <tr style={bg} key={ submission.id }>
        <td id={ submission.id } className={`text-center ${submission.status}`} 
          onMouseEnter={ (e) => this.handleEnter(e.target.id, e.target.classList) }
          onMouseLeave={ (e) => this.handleLeave(e.target.id, e.target.classList) }
          onMouseDownCapture={ (e) => this.handleClick(e.currentTarget.id, e.currentTarget.classList) } >
          { this.getStatusIcon(submission.id, submission.status) }</td>
        <td>{ submission.priority }</td>
        <td className={styles.timestamp}>{ submission.submittedAt.toLocaleString() }</td>
        <td><a href={ submission.courseUrl } target='_blank'>{ submission.courseName }</a></td>
        <td><a href={ submission.url } target='_blank'>{ submission.name }</a></td>
      </tr>
    )
  }

  render() {
    return(
      <React.Fragment>
        <Table variant='dark' striped bordered hover responsive>
          <thead>
            <tr>
              <th>Status</th>
              <th>Priority</th>
              <th>Submitted</th>
              <th>Course</th>
              <th>Assignment</th>
            </tr>
          </thead>
          <tbody>
            { this.props.queue.map((submission) => this.getTr(submission)) }
          </tbody>
        </Table>
      </React.Fragment>
    )
  }
}