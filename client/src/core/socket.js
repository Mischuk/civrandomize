import { io } from "socket.io-client";
const socket = io({timeout: 2000000});

export default socket;