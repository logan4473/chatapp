import './App.css'
import {useState} from 'react'
import io from 'socket.io-client'
import Chats from './Chats'

const socket = io.connect('http://localhost:4000')

function App() {

  const [username,setUsername] = useState('')
  const [roomID,setRoomID] = useState('')
  const [showChats,setShowChats] = useState(false)

  const joinRoom = ()=>{
    if(username!=='' && roomID!==''){
        socket.emit('join',roomID);
        setShowChats(true);
    }
  }

  return (
    <div className="App">
      {!showChats?<>
      <h2>Join Chat</h2>
      <input type='text' placeholder='Username' onChange={(event)=>{setUsername(event.target.value)}} />
      <input type='text' placeholder='Room ID' onChange={(event)=>{setRoomID(event.target.value)}} />
      <button onClick={joinRoom}>Join</button>
      </>
      :
      <Chats username={username} roomID={roomID} socket={socket} />
      }
    </div>
  )
}

export default App
