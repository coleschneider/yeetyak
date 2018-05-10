import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import App from './components/App'
import {createStore, applyMiddleware} from 'redux'
import {combineReducers, Provider} from 'react-redux';
import logger from 'redux-logger';

const socket = (state={}, action) => {
    switch(action.type){
        case "SOCKET_CONNECTED":
        return {
            // ...state,
            id: action.id
        }
    
    default: return state
    }
}


const store = createStore(
    socket,
    applyMiddleware(logger)
)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))