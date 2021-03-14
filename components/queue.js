import React from 'react';

import Table from 'react-bootstrap/Table';

export default class Queue extends React.Component {

  constructor(props) {
    super(props);
  }

  getTr = (submission) => {
    let bg = submission.priority == 1 ? {backgroundColor: '#7c2020'} : {};
    return(
      <tr style={bg} key={ submission.id }>
        <td>{ submission.priority }</td>
        <td style={{minWidth: '185px'}}>{ submission.submittedAt.toLocaleString() }</td>
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