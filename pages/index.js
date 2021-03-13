import React from 'react';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import Login from '../components/login';
import Nav from '../components/nav';
import Queue from '../components/queue';

import Head from 'next/head'

import "bootswatch/dist/darkly/bootstrap.min.css";

export default function HomePage() {
  return <Index />;
}

class Index extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      canvasUser: {
        name: '...',
        avatar_url: '',
      },
      sort: {
        field: 'submitted',
        type: 'asc'
      },
      queue: [],
      priorities: [
        ['meeting', 'cisco', 'course completion'],
        ['pacific', ' ace ']
      ],
    }
  }

  sortQueue = () => {
    let newQueue = this.state.queue;
    switch(this.state.sort.field) {
      case 'submitted':
        if (this.state.sort.type === 'asc') {
          newQueue.sort((a, b) => a.submittedAt - b.submittedAt)
        } else {
          newQueue.sort((a, b) => b.submittedAt - a.submittedAt)
        }
        break;
    }
    newQueue.sort((a, b) => a.priority - b.priority)
    this.setState((state) => ({
      queue: newQueue
    }))
  }

  toggleLogin = () => {
    this.setState((state) => ({
      loggedIn: false,
      canvasUrl: '',
      apiKey: ''
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
    // const { queue = [] } = this.state.queue;
    return(
      <React.Fragment>
        <Head>
          <title>Canvasser</title>
        </Head>
        <Nav />
        <Image src={ this.state.canvasUser.avatar_url } roundedCircle />
        <p>{ this.state.loggedIn ? `Logged in as ${this.state.canvasUser.name}` : "Logged out" }</p>
        <Button onClick={ this.toggleLogin }>
          { this.state.loggedIn ? "Logout" : "Login" }
        </Button>
        <Button onClick={ this.getQueue }>
          Test getQueue
        </Button>
        <Queue 
        queue={ this.state.queue }
        onSort={ this.sortQueue }/>
        <Login 
          loggedIn={ this.state.loggedIn } 
          onLoginSubmit={ this.saveLoginInfo }/>
      </React.Fragment>
    )
  }
}