import React, { createContext, useRef, useEffect, useState } from "react";

import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext()

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [Me, setMe] = useState('')
    const [stream, setStream] = useState(null)
    const [CallDetails, setCallDetails] = useState({})
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
            (currentStream) => {
                setStream(currentStream)
                myVideo.current.srcObject = currentStream;
            }
        )

        socket.on('me', (id) => {
            setMe(id)
        })
        //ei jini takke bola hoi nam koron
        socket.on('calluser', ({ from, name: callName, signal }) => {
            setCallDetails({ isReceived: true, from, name: callName, signal })
        })
    }, [])

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: CallDetails.from });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(CallDetails.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: Me, name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{
            CallDetails,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            Me,
            callUser,
            leaveCall,
            answerCall,
        }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };