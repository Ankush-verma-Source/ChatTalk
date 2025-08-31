import { useContext } from "react";
import { SocketContext } from "./socket.jsx";

const useSocket = () => useContext(SocketContext);

export default useSocket;
