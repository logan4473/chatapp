import React, { useEffect, useState } from 'react';

function Chats({socket,username,roomID}) {

  const [message,setMessage] = useState('');
  const [messageList,setMessageList] = useState([]);

  const sendMessage = async ()=>{
    if(message!=='')
    {
      const data = {
        roomID,message,username,time: new Date(Date.now()).getHours() +':'+ new Date(Date.now()).getMinutes()
      }

      await socket.emit('send',data);
      setMessageList((list)=>[...list,data]);
    }
  };

  useEffect(()=>{
    socket.on('receive',(data)=>{
      setMessageList((list)=>[...list,data]);
    });
  },[socket]);

  return (
    <>
        <h3>Chats</h3>
        {messageList.map((message)=>(
          <>
          <div className='message' id={message.username===username?'sender':'reciever'}>{message.message}</div>
          <span className='user' id={message.username===username?'sender':'reciever'}>{message.username}  {message.time}</span>
          </>
        ))}
        <input type='text' placeholder='Type your message...' onChange={(event)=>{setMessage(event.target.value)}} />
        <button className='send' onClick={sendMessage}>Send</button>
    </>
  )
}

export default Chats