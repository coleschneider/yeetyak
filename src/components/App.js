import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import {connect} from 'react-redux'
import { rejects } from 'assert';



const mapStateToProps = state => ({
  ...state.socket
})

const mapDispatchToProps = dispatch => ({
    onLoad: (id)=> dispatch({
      type: "SOCKET_CONNECTED",
      id
    }),
    fetchingLocation: () => dispatch({
      type: "FETCHING_USER_LOCATION"
    }),
    // loadLocation: ()
})

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { messages: [] }
    
    
    this.socket = io('/')
    const sock = this.socket
    console.log(sock)
    this.props.onLoad(sock.id)
    this.handleSubmit = event => {
      const body = event.target.value
      if (event.keyCode === 13 && body) {
        const message = {
          body,
          from: 'Me'
        }
        this.setState({ messages: [message, ...this.state.messages] })
        this.socket.emit('message', body)
        event.target.value = ''
      }
    }
    
  }

  componentDidMount () {
    
    this.props.fetchingLocation()
    var getPosition = function (options) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    }
    
    getPosition()
      .then((position) => {
        console.log(position);
      })
      .catch((err) => {
        console.error(err.message);
      });
      
    
    
    
    
    this.socket.on('message', message => {
      
      this.setState({ messages: [message, ...this.state.messages] })
    })
  }

  

  render () {
    const messages = this.state.messages.map((message, index) => {
      const img = message.img ? <img src={message.img} width='200px' /> : null
      return <li key={index}><b>{message.from}:</b>{message.body} {img}</li>
    })
    return (
      <div>
     
        <input type='text' placeholder='Enter a message...' onKeyUp={this.handleSubmit} />
        {messages}
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)