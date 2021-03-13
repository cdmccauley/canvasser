import React from 'react';

import Table from 'react-bootstrap/Table';

export default class Queue extends React.Component {

  constructor(props) {
    super(props);

    this.getTr = this.getTr.bind(this);
  }

  getTr = (submission) => {
    return(
      <tr key={ submission.id }>
        <td>{ submission.priority }</td>
        <td>{ submission.submittedAt.toLocaleString() }</td>
        <td><a href={ submission.courseUrl } target='_blank'>{ submission.courseName }</a></td>
        <td><a href={ submission.url } target='popup'>{ submission.name }</a></td>
      </tr>
    )
  }

  render() {
    return(
      <React.Fragment>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
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