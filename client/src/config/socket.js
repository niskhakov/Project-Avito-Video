import io from "socket.io-client"
import { handleData, handleReady } from './webrtc'
const SIGNALING_SERVER_URL = "https://ws.simpletask.dev"

// Signaling methods
let socket

function getSocket() {
    return socket
}

function initConnection(credentials) {
    if (socket === undefined) {
        socket = io(SIGNALING_SERVER_URL, { autoConnect: false, query: credentials })

        socket.on("info", (message) => {
            console.log("info: ", message)
        })

        socket.on("data", (data) => {
            handleData(data)
        })

        socket.on("ready", (data) => {
            handleReady(data)
        })

        socket.on("error", () => {
            alert("Unauthorized access")
            setTimeout(() => {
                document.location.reload()
            }, 6)
        })
    }
    // console.log(socket)
}

let sendData = (data) => {
    socket.emit("data", data)
}
export { sendData, initConnection }
export default getSocket;