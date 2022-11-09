import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors())


io.on("connection", (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {   //ei jinis ta ke bola hoi socket event handler
        socket.broadcast.emit('call end korlam');
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from, name })
    })
    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal)
    })
});

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send("Server is running");
})

httpServer.listen(PORT, () => { console.log(`Server is running om port ${PORT}`) });