import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import LoginRoute from "./components/auth/loginRoute";
import AppLayout from "./components/layout/AppLayout";
import {LayoutLoader }from "./components/layout/Loaders";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./constants/config.js";
import { useDispatch /* useSelector*/ } from "react-redux";
import { login, logout } from "./features/authSlice/authSlice.js";
import { Toaster } from "react-hot-toast";
import {SocketProvider} from "./socket.jsx";

const Home = lazy(() => import("./pages/Home")); // better for unwanted components loading
const Groups = lazy(() => import("./pages/Groups"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));

function App() {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  // console.log(loader);

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => {
        // console.log(data.data);
        return dispatch(login(data.data));
      })
      .catch(() => {
        return dispatch(logout());
      });
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute />
                </SocketProvider>
              }
            >
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Home />
                  </AppLayout>
                }
              ></Route>
              <Route path="/group" element={<Groups />}></Route>
              <Route
                path="/chat/:chatId"
                element={
                  <AppLayout>
                    <Chat />
                  </AppLayout>
                }
              ></Route>
            </Route>

            <Route
              path="/login"
              element={
                <LoginRoute redirect="/">
                  <Login />
                </LoginRoute>
              }
            ></Route>

            <Route path="/admin" element={<AdminLogin />}></Route>
            <Route path="/admin/dashboard" element={<Dashboard />}></Route>
            <Route path="/admin/users" element={<UserManagement />}></Route>
            <Route path="/admin/chats" element={<ChatManagement />}></Route>
            <Route
              path="/admin/messages"
              element={<MessageManagement />}
            ></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
}

export default App;
