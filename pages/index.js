import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Login from '../components/login';
import Nav from '../components/nav';
import Filters from '../components/filters';
import Queue from '../components/queue';

import Head from 'next/head'

import "bootswatch/dist/slate/bootstrap.min.css";

export default function HomePage() {
  return <Index />;
}

class Index extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      canvasUser: {
        name: '',
        avatar_url: '',
      },
      sort: {
        field: 'submitted',
        type: 'asc'
      },
      queue: [],
      filteredQueue: [],
      priorities: [
        ['meeting', 'cisco', 'course completion'],
        ['pacific', ' ace ']
      ],
      viewOptions: false,
      selfReserved: [],
      otherReserved: [],
      courseFilter: '',

    }
  }

  // TODO: need to set status on filtered queue too
  setStatus = (id, status) => {
    let index = this.state.queue.indexOf(this.state.queue.find((subId) => subId.id.toString() == id))
    if (index > -1) {
      let updatedQueue = this.state.queue;
      updatedQueue[index].status = status;
      if (status == 'self-reserved') {
        this.setState((state) => ({
          queue: updatedQueue,
          selfReserved: [ ...this.state.selfReserved, id ]
        }), this.setFilteredQueue(this.state.courseFilter) )
      } else {
        if (this.state.selfReserved.includes(id)) {
          let updatedReserved = this.state.selfReserved.filter((resId) => resId != id)
          this.setState((state) => ({
            selfReserved: updatedReserved,
            queue: updatedQueue
          }), this.setFilteredQueue(this.state.courseFilter) )
        } else {
          this.setState((state) => ({
            queue: updatedQueue
          }), this.setFilteredQueue(this.state.courseFilter) )
        }
      }
    } else {
      console.log(id, 'not found')
    }
  }

  // TODO: right now will set course filter, 
  // going forward could have type parameter for course, priority, status, assignment...
  setFilteredQueue = (filter) => {
    let updatedQueue = this.state.queue.filter((submission) => submission.courseName.toLowerCase().includes(filter.toLowerCase()))
    this.setState((state) => ({
      courseFilter: filter,
      filteredQueue: updatedQueue
    }))
  }

  toggleOptions = () => {
    this.setState((state) => ({
      viewOptions: !this.state.viewOptions
    }))
  }

  sortQueue = () => {
    let updatedQueue = this.state.queue;
    switch(this.state.sort.field) {
      case 'submitted':
        if (this.state.sort.type === 'asc') {
          updatedQueue.sort((a, b) => a.submittedAt - b.submittedAt)
        } else {
          updatedQueue.sort((a, b) => b.submittedAt - a.submittedAt)
        }
        break;
    }
    updatedQueue.sort((a, b) => a.priority - b.priority)
    this.setState((state) => ({
      queue: updatedQueue
    }))
  }

  toggleLogin = () => {
    this.setState((state) => ({
      loggedIn: false,
      canvasUser: {
        name: '',
        avatar_url: '',
      },
      canvasUrl: '',
      apiKey: '',
      queue: []
    }));
  }

  saveLoginInfo = (canvasUrl, apiKey) => {
    localStorage.setItem('canvasUrl', canvasUrl);
    localStorage.setItem('apiKey', apiKey);
    this.checkUserData();
  }

  saveCourses = (courses) => {
    localStorage.setItem('courses', courses);
  }

  checkUserData = () => {
    if (!localStorage.getItem('canvasUrl') || !localStorage.getItem('apiKey')) {
      this.setState((state) => ({
        loggedIn: false
      }));
    } else {
      this.setState((state) => ({
        loggedIn: true,
        canvasUrl: localStorage.getItem('canvasUrl'),
        apiKey: localStorage.getItem('apiKey')
      }), this.getCanvasUser );
    }
  }

  callApi = (endpoint, callback) => {
    fetch('/api/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `${this.state.canvasUrl + endpoint + this.state.apiKey}`
      })
    })
    .then((res) => res.json())
    .then((data) => callback(data.canvasData))
    .catch((err) => console.log(err));
  }

  callQueue = (courseInfo, callback) => {
    fetch('/api/queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: this.state.canvasUrl,
        key: this.state.apiKey,
        courses: courseInfo
      })
    })
    .then((res) => res.json())
    .then((data) => callback(data.queue))
    .catch((err) => console.log(err));
  }

  getCanvasUser = () => {
    // returns object
    this.callApi('/api/v1/users/self?access_token=', (canvasData) => {
      this.setState((state) => ({
        canvasUser: canvasData
      }), this.getUserCourses );
    });
  }

  getUserCourses = () => {
    console.log('getting courses')
    // returns array of objects
    if (!localStorage.getItem('courses')) {
      this.callApi('/api/v1/courses?enrollment_type=teacher&per_page=1000&include[]=needs_grading_count&access_token=', (canvasData) => {
        let minCourses = []
        canvasData.forEach((course) => minCourses.push({id: course.id, name: course.name}))
        localStorage.setItem('courses', JSON.stringify(minCourses));
        this.setState((state) => ({
          courses: canvasData
        }), this.startQueueRefresh );
      });
    } else { // should also check if state is already set
      this.setState((state) => ({
        courses: JSON.parse(localStorage.getItem('courses'))
      }), this.startQueueRefresh );
    }
  }

  setSelfReserved = (submissions) => {
    submissions.forEach((submission) => {
      this.state.selfReserved.forEach((id) => {
        if (submission.id == id) {
          submission.status = 'self-reserved'
        }
      })
    })
  }

  setSubPriorities = (submissions) => {
    let userPriority;
    submissions.forEach((submission) => {
      userPriority = this.state.priorities.length + 1;
      this.state.priorities.forEach((level) => {
        level.forEach((name) => {
          if (submission.name.toLowerCase().includes(name.toLowerCase())) {
            userPriority = this.state.priorities.indexOf(level) + 1
          }
        })
      })
      submission.priority = userPriority
    })
  }

  setSubDates = (submissions) => {
    submissions.forEach((submission) => {
      submission.submittedAt = new Date(submission.submittedAt)
    })
  }

  startQueueRefresh = () => {
    this.getQueue();
    setInterval(() => this.getQueue() , 60000);
  }

  //TODO: validate courses prior to accessing
  getQueue = () => {
    console.log('getting queue')
    this.callQueue(this.state.courses, (data) => {
      this.setSubPriorities(data)
      this.setSelfReserved(data)
      this.setSubDates(data)
      this.setState((state) => ({
        queue: data
      }), this.sortQueue )
    })
  }

  componentDidMount() {
    this.checkUserData();
  }

  render() {
    return(
      <React.Fragment>
        <Head>
          <title>Canvasser</title>
        </Head>
        <Nav 
          loggedIn={ this.state.loggedIn }
          avatarUrl={ this.state.canvasUser.avatar_url }
          onLoginToggle={ this.toggleLogin }/>
        <Container fluid='lg'>
          <Row>
            <Col>
              <Filters 
                viewOptions={ this.state.viewOptions }
                onOptionsToggle={ this.toggleOptions }
                onFilterQueue={ this.setFilteredQueue }/>
            </Col>
          </Row>
          <Row>
            <Col>
            <Queue 
              queue={ this.state.courseFilter == '' ? this.state.queue : this.state.filteredQueue }
              onSort={ this.sortQueue }
              onSetStatus={ this.setStatus }/>
            </Col>
          </Row>
        </Container>
        <Login 
          loggedIn={ this.state.loggedIn } 
          onLoginSubmit={ this.saveLoginInfo }/>
      </React.Fragment>
    )
  }
}