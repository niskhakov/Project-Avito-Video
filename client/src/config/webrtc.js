import socket, { sendData } from "./socket"
// Config variables: change them to point to your own servers
const TURN_SERVER_URL = "172.104.246.200:3478"
const TURN_SERVER_USERNAME = "username"
const TURN_SERVER_CREDENTIAL = "credential"
// WebRTC config: you don't have to change this for the example to work
// If you are testing on localhost, you can just use PC_CONFIG = {}
const PC_CONFIG = {
    iceServers: [
        {
            urls: "turn:" + TURN_SERVER_URL + "?transport=tcp",
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL,
        },
        {
            urls: "turn:" + TURN_SERVER_URL + "?transport=udp",
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL,
        },
        { urls: "stun:74.125.142.127:19302" },
        { urls: "stun:stun.1.google.com:19302" },
    ],
}



// WebRTC methods
let pc
let localStream
let remoteStreamElement
let localStreamElement
let userDetails // contain info about caller (also have security token) and callee
let callbacks = {}
let registerWebrtcCallback = (event, callback) => {
    callbacks[event] = callback
    // console.log(callbacks)
}

const handleData = (data) => {
    console.log("Data received: ", data)
    handleSignalingData(data)
}

const handleReady = () => {
    console.log("Ready")
    // Connection with signaling server is ready, and so is local stream
    createPeerConnection()
    sendOffer()
}

let getLocalStream = (videoElement, localVideoElement, constraints, callDetails) => {
    // add middlewares specific to webrtc

    // console.log(`getLocalStream: ${callDetails}`)
    userDetails = callDetails
    remoteStreamElement = videoElement
    localStreamElement = localVideoElement
    console.dir(`Remote Stream: ${remoteStreamElement}`)
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            console.log("Stream found")
            localStream = stream
            localStreamElement.srcObject = localStream
            if (!userDetails.acceptCall) {
                console.log(socket)
                socket().emit("call", userDetails.callInfo)
            }
        })
        .catch((error) => {
            console.error("Stream not found: ", error)
        })
}

let createPeerConnection = () => {
    console.log("LocalStream: " + localStream)
    try {
        pc = new RTCPeerConnection(PC_CONFIG)
        pc.onicecandidate = onIceCandidate
        pc.onaddstream = onAddStream
        pc.addStream(localStream)
        console.log("PeerConnection created")
    } catch (error) {
        console.error("PeerConnection failed: ", error)
    }
}

let sendOffer = () => {
    console.log("Send offer")
    pc.createOffer().then(setAndSendLocalDescription, (error) => {
        console.error("Send offer failed: ", error)
    })
}

let sendAnswer = () => {
    console.log("Send answer")
    pc.createAnswer().then(setAndSendLocalDescription, (error) => {
        console.error("Send answer failed: ", error)
    })
}

let setAndSendLocalDescription = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription)
    console.log("Local description set")
    sendData(sessionDescription)
}

let onIceCandidate = (event) => {
    if (event.candidate) {
        console.log("ICE candidate")
        sendData({
            type: "candidate",
            candidate: event.candidate,
        })
    }
}

let onAddStream = (event) => {
    console.log("Add stream")
    remoteStreamElement.srcObject = event.stream
}

let handleSignalingData = (data) => {
    if (data.type === "unauthorized") {
        alert("Unauthorized access or person already connected")
        setTimeout(() => {
            document.location.reload()
        }, 6)
    }
    if (data.type === "incoming_call") {
        console.log(data)
        callbacks["incoming_call"](data)
    }
    // if (localStream !== undefined) {
    console.log(data)
    switch (data.type) {
        case "offer":
            createPeerConnection()
            pc.setRemoteDescription(new RTCSessionDescription(data))
            sendAnswer()
            break
        case "answer":
            pc.setRemoteDescription(new RTCSessionDescription(data))
            break
        case "candidate":
            pc.addIceCandidate(new RTCIceCandidate(data.candidate))
            break

    }
}
export { localStream, registerWebrtcCallback, handleData, handleReady };
export default getLocalStream;