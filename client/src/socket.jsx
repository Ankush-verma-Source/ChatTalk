// import { createContext, useMemo } from "react";
// import io from "socket.io-client";

// const SocketContext = createContext();



// const SocketProvider = ({ children }) => {
//   const socket = useMemo(() =>   io("http://localhost:3000", { withCredentials: true })
// , []); 
//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export default SocketProvider;




import { createContext, useMemo } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

// const useSocket = () => useContext(SocketContext);


const SocketProvider = ({ children }) => {
  const socket = useMemo(() =>io(server, { withCredentials: true })
, []); 
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext/*useSocket*/ }; // creating a new file for this



