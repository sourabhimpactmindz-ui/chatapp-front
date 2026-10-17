import { io } from "socket.io-client";

export const socket = io("http://localhost:3005", {
  withCredentials: true,
  autoConnect: false,
});

export const  connectSocket = (userId) =>{
    if(!userId) return;

    if(!socket.connected){
        socket.connect();
    }

    socket.once("connect" , () => {
        console.log("socket connected : " , socket.id)

        socket.emit("setup" ,userId)
    })

}