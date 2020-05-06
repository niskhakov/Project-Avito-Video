import io from "socket.io-client"
const SIGNALING_SERVER_URL = "https://ws.simpletask.dev"

// Signaling methods
let socket = io(SIGNALING_SERVER_URL, { autoConnect: false })

// socket.on("connect", () => {
//     // console.log(`Send call details: ${userDetails}`)
// })

socket.on("info", (message) => {
    console.log("info: ", message)
})

let sendData = (data) => {
    socket.emit("data", data)
}
export { sendData }
export default socket;