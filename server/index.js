const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 4000;
const {Server} = require('socket.io');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors :
    {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    },
});


io.on('connection',(socket)=>{
    console.log(socket.id);

    socket.on('join',(roomID)=>{
        socket.join(roomID);
        console.log(`User Joined Room : ${roomID}`);
    });

    socket.on('send',(data)=>{
        socket.to(data.roomID).emit('receive',data);
    });

    socket.on('disconnect',()=>{
        console.log('User Disconnected',socket.id);
    });
})

server.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`)
});