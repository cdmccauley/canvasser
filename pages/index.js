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
      courses: [],
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

  // TODO: send self-reserved and clear out db entries
  caReserver = (sgUrl, action) => {
    console.log('caReserver called')
    fetch('/api/ca-reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: action,
        _id: sgUrl,
        user: this.state.canvasUser.name
      })
    })
  }

  // TODO: need to set status on filtered queue too
  // reserve then unreserve will send back a reserved
  setStatus = (id, status) => {
    
    let index = this.state.queue.indexOf(this.state.queue.find((subId) => subId.id.toString() == id))
    if (index > -1) {
      let updatedQueue = this.state.queue;
      let prevStatus = updatedQueue[index].status
      if (prevStatus == 'unreserved-hover' && status == 'self-reserved' || prevStatus == 'self-reserved-hover' && status == 'unreserved-hover' || prevStatus =='self-reserved' && status == 'unreserved-hover') {
        let updatedReserved = this.state.selfReserved;
        if (updatedReserved.includes(id)) {
          updatedReserved.splice(updatedReserved.indexOf(id), 1) // unreserve
          // preset statuses temporarily for a responsive ui
          updatedQueue[index].status = 'unreserved'
          this.setState((state) => ({
            queue: updatedQueue
          }), this.caReserver(updatedQueue[index].url, 'unreserve')) // interface with ca
        } else {
          updatedReserved.push(id) // reserve
          // preset statuses temporarily for a responsive ui
          updatedQueue[index].status = 'self-reserved'
          this.setState((state) => ({
            queue: updatedQueue
          }), this.caReserver(updatedQueue[index].url, 'reserve')) // interface with ca
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
        }), this.setFilteredQueue(this.state.courseFilter))
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

  // TODO: clear browser storage, clear refresh
  toggleLogin = () => {
    localStorage.removeItem('canvasUrl')
    localStorage.removeItem('apiKey')
    localStorage.removeItem('courses')
    this.setState((state) => ({
      loggedIn: false,
      canvasUser: {
        id: '',
        name: '',
        avatar_url: '',
      },
      courses: [],
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

  // parse a Link header
  //
  // Link:<https://example.org/.meta>; rel=meta
  //
  // var r = parseLinkHeader(xhr.getResponseHeader('Link');
  // r['meta'] outputs https://example.org/.meta
  //
  parseLinkHeader = (link) => {
    var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

    var matches = link.match(linkexp);
    var rels = {};
    for (var i = 0; i < matches.length; i++) {
        var split = matches[i].split('>');
        var href = split[0].substring(1);
        var ps = split[1];
        var s = ps.match(paramexp);
        for (var j = 0; j < s.length; j++) {
            var p = s[j];
            var paramsplit = p.split('=');
            var name = paramsplit[0];
            var rel = paramsplit[1].replace(/["']/g, '');
            rels[rel] = href;
        }
    }
    return rels;
  }

  callCourses = (endpoint) => {
    let links;
    let resData;
    return fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `${endpoint}${this.state.apiKey}`
      })
    })
    .then((res) => {
      // console.log('link headers: ', res.headers.get('link'))
      links = this.parseLinkHeader(res.headers.get('link'))
      // console.log('next: ', links['next']) // undefined if doesn't exist
      // create new json that stores res.json and headers
      return res.json()
    })
    .then((data) => {
      resData = data
      if (links['next'] != undefined) {
        // console.log('link header found')
        data.next = links['next']
      }
      // callback(resData) // also removing callback from parameters
      return resData
    })
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
        userReserved: this.state.selfReserved,
        url: this.state.canvasUrl,
        key: this.state.apiKey
      })
    })
    .then((res) => res.json())
    .then((data) => {
      this.setState((state) => ({
        reserved: data.reserved
      }), callback )
    })
    .catch((err) => console.log(err));
  }

  getCanvasUser = () => {
    // returns object
    this.callApi('/api/v1/users/self?access_token=', (canvasData) => {
      this.setState((state) => ({
        canvasUser: canvasData // user id is stored as number
      }), this.getUserCourses(`${this.state.canvasUrl}/api/v1/courses?enrollment_type=teacher&access_token=`) );
    });
  }

  //TODO: store courses to local
  setUserCourses = (courses) => {
    // console.log('storing courses in state: ', courses)
    this.setState((state) => ({
      courses: [...state.courses, ...courses]
    }), () => {
      this.getQueue()
      this.startQueueRefresh()
    });
  }

  //TODO: get courses in background when user is logged in
  getUserCourses = (endpoint, localData = []) => {
    // console.log('getting courses: ', endpoint)
    let data = this.callCourses(endpoint)
    data.then((res) => {
      if (res.next != undefined) {
        this.getUserCourses(`${res.next}&access_token=`, localData.concat(res.canvasData))
      } else {
        // console.log('localData: ', localData.concat(res.canvasData))
        this.setUserCourses(localData.concat(res.canvasData))
      }
    })
  }

  setReserved = (submissions) => {
    submissions.forEach((submission) => {
      let status = 'unreserved'
      if (Object.keys(this.state.reserved).length > 0) {
        Object.keys(this.state.reserved).forEach((id) => {
          if (this.state.reserved[id].includes(submission.id.toString())) {
            // reserved not updating on startup/refresh here?
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

  clearSelfReserved = () => {
    console.log('clearing self-reserved')
    if (Array.isArray(this.state.queue)) {
      let caIds = []
      //create list of ca ids from selfreserved
      try {
        this.state.selfReserved.forEach((id) => {
          caIds.push(this.state.queue.filter((sub) => sub.id.toString() == id)[0].url)
        })
        this.caReserver(caIds, 'clear')
      } catch (e) {
        console.log('clearSelfReserved exception: ', e)
      }
    }
  }

  //TODO: validate courses prior to accessing
  getQueue = () => {
    console.log('getting queue')
    this.clearSelfReserved() // moved to setFilterQueue
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