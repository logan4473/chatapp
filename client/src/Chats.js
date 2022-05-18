import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

function Chats({socket,username,roomID}) {

  const [messageList,setMessageList] = useState([]);
  const [quill,setQuill] = useState()

  const wrapperRef = useCallback((wrapper)=>{
      if (wrapper==null) return
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const q = new Quill(editor,{theme:'snow',
      modules:{toolbar:
      [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
        
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
        
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
        
          ['clean']                                         // remove formatting button
        ]}

      })
      setQuill(q)
  },[])

  const sendMessage = async ()=>{
    const message = quill.getContents()
    if(message.ops[0].insert.trim()!=='')
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
          <div className='message' id={message.username===username?'sender':'reciever'} dangerouslySetInnerHTML={{__html:new QuillDeltaToHtmlConverter(message.message.ops).convert()}} />
          <span className='user' id={message.username===username?'sender':'reciever'}>{message.username}  {message.time}</span>
          </>
        ))}
        <div id='container' ref={wrapperRef}></div>
        <button className='send' onClick={sendMessage}>Send</button>
    </>
  )
}

export default Chats