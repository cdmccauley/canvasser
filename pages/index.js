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
        id: '',
        name: '',
        avatar_url: '',
      },
      autoRefresh: true,
      refresh: 60,
      refreshInterval: null,
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
      reserved: {},
    }
  }

  // TODO: need to set status on filtered queue too
  setStatus = (id, status) => {

    let index = this.state.queue.indexOf(this.state.queue.find((subId) => subId.id.toString() == id))
    if (index > -1) {
      let updatedQueue = this.state.queue;
      let prevStatus = updatedQueue[index].status
      if (prevStatus == 'unreserved-hover' && status == 'self-reserved' || prevStatus == 'self-reserved-hover' && status == 'unreserved-hover') {
        let updatedReserved = this.state.selfReserved;
        if (updatedReserved.includes(id)) {
          updatedReserved.splice(updatedReserved.indexOf(id), 1) // unreserve
        } else {
          updatedReserved.push(id) // reserve
        }
        this.setState((state) => ({
          selfReserved: updatedReserved
        }), this.postReserved(() => {
          this.setReserved(updatedQueue)
          this.setState((state) => ({
            queue: updatedQueue
          }), this.setFilteredQueue(this.state.courseFilter) )
        }))
      } else {
        updatedQueue[index].status = status
        this.setState((state) => ({
          queue: updatedQueue
        }))
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
    }), this.setFilteredQueue(this.state.courseFilter) )
  }

  // TODO: clear browser storage
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
        courses: courseInfo,
      })
    })
    .then((res) => res.json())
    .then((data) => callback(data.queue))
    .catch((err) => console.log(err));
  }

  getReserved = (callback) => {
    fetch('/api/reserve', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => callback(data.reserved))
    .catch((err) => console.log(err));
  }

  postReserved = (callback) => {
    fetch('/api/reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.state.canvasUser.id,
        userReserved: this.state.selfReserved
      })
    })
    .then((res) => res.json())
    .then((data) => this.setState((state) => ({
      reserved: data.reserved
    }), callback ))
    .catch((err) => console.log(err));
  }

  getCanvasUser = () => {
    // returns object
    this.callApi('/api/v1/users/self?access_token=', (canvasData) => {
      this.setState((state) => ({
        canvasUser: canvasData // user id is stored as number
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
        }), () => {
          this.getQueue()
          this.startQueueRefresh()
        } );
      });
    } else { // should also check if state is already set
      this.setState((state) => ({
        courses: JSON.parse(localStorage.getItem('courses'))
      }), () => {
        this.getQueue()
        this.startQueueRefresh()
      } );
    }
  }

  setReserved = (submissions) => {
    submissions.forEach((submission) => {
      let status = 'unreserved'
      if (Object.keys(this.state.reserved).length > 0) {
        Object.keys(this.state.reserved).forEach((id) => {
          if (this.state.reserved[id].includes(submission.id.toString())) {
            status = id == this.state.canvasUser.id.toString() ? 'self-reserved' : 'other-reserved'
          }
        })
      }
      submission.status = status
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
    if (this.state.refreshInterval != null) {
      clearInterval(this.state.refreshInterval)
      console.log('cleared last refresh')
    }
    // this.getQueue();
    this.setState((state) => ({
      autoRefresh: true,
      refreshInterval: setInterval(() => this.getQueue() , state.refresh * 1000)
    }), () => console.log('started refresh'))
  }

  //TODO: validate courses prior to accessing
  getQueue = () => {
    console.log('getting queue')
    this.callQueue(this.state.courses, (data) => {
      this.setSubPriorities(data)
      this.setSubDates(data)
      this.postReserved(() => {
        this.setReserved(data)
        this.setState((state) => ({
          queue: data
        }), this.sortQueue )
      })
    })
  }

  setRefreshRate = (rate) => {
    let validatedRate = Number.isNaN(Number(rate)) || Number(rate) < 20 ? this.state.refresh : Number(rate)
    this.setState((state) => ({
      refresh: validatedRate
    }), () => {
      if (this.state.autoRefresh) {
        this.startQueueRefresh()
      }
    })
  }

  toggleRefresh = (setting) => {
    console.log('index.js, toggleRefresh: ', setting)
    if (setting) {
      this.getQueue()
      this.startQueueRefresh()
    } else {
      clearInterval(this.state.refreshInterval)
      this.setState((state) => ({
        refreshInterval: null,
        autoRefresh: false
      }), () => console.log('stopped refresh'))
    }
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
                autoRefresh={ this.state.autoRefresh }
                refreshValue={ this.state.refresh }
                viewOptions={ this.state.viewOptions }
                onOptionsToggle={ this.toggleOptions }
                onFilterQueue={ this.setFilteredQueue }
                onRefreshChange={ this.setRefreshRate }
                onRefreshCheckedChange={ this.toggleRefresh } />
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