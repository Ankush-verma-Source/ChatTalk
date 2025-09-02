// Chat App :

/* How to plan to design a chat app : // better for planning  

--> Using Git books to design a feature list of a chat app. & many more... */

/* Frontend :
        --> npm i : MUI , react-router-dom 
        --> npm i react-chartjs-2 chart.js :  for graphs and all...
        --> moment(library for date matching)

        --> Not official(form validation) : 6pp(various hooks available for react like infite scroll --> used for previous data loading etc...)
        --> npm i express-validator : for form validation in server side

        
        --> npm i react-hot-toast : for notifications etc... | npm toastify : another option 
        --> npm i react-helmet-async : for title etc... | npm install react-helmet-async --legacy-peer-deps |  not installing 
            --> alternatives : @tanstack/react-head  | react-head ( we use this one)
*/









/* In main.jsx : 
--> use cssBaseline : from @mui/material : use for default css with m and p = zero
--> use react-head : for title etc... : using headProvider , title , meta , link
--> provide centeral store : from react-redux for authentication
*/

/* This is for using react-head : use for head tags & server side rendering etc... 
--> use in individual pages : import {headProvider , Link , Title, Meta, } from 'react-head'; 
*/
import { CssBaseline } from "@mui/material"; // use for default css with m and p = zero
import { HeadProvider } from "react-head";
createRoot(document.getElementById("root")).render(
  <HeadProvider headTags={[]}>
    <CssBaseline />
    <div onContextMenu={(e) => e.preventDefault()}>
      <App />
    </div>
  </HeadProvider>
);

// --> How to use this :
import { HeadProvider, Title, Meta, Link } from "react-head";
function Title1({
  title = "Chat App",
  description = "this is the Chat App called ChatTalk",
}) {
  return (
    <HeadProvider>
      {/* Head elements */}
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      <Link rel="icon" href="/favicon.ico" />

      {/* Page content */}
    </HeadProvider>
  );
}
export default Title1;







/* In app.jsx : use lazy form react : 
--> To use lazy : to load only those components which needed
--> using PrivateRoute | loginRoute : for private routes : learn Outlet concept 

*/
/* using lazy form react : import only those components which are used in the page : otherwise not all import by default
 */
import { lazy, Suspense } from "react"; // Suspense show loading until the component is loaded
const Home = lazy(() => import("./pages/Home")); // using this component import only if needed other wise not imported
function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/about" element={<h1>About</h1>}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

// This is used whenver we add multiple nested routes in one protected route
import { Outlet } from "react-router-dom";
function ProtectRoute({ children, user, redirect = "/login" }) {
  if (!user) return <Navigate to={redirect} />;
  else return children ? children : <Outlet />; // used whenver we have multiple nested private routes added
}

// for this type of private route :
<Route element={<ProtectRoute user={user} />}>
  <Route path="/home" element={<Home />}></Route>
  <Route path="/group" element={<Group />}></Route>
  <Route path="/chat/:chatId" element={<Chat />}></Route>
</Route>;
// if we use protectRoute component inside every private element the pass actual children in each route element then we only have to pass children not outlet required






/* First in Login Page : 
--> we create a form for login & signup : using usestate hook 
--> the use 6pp : for form validation we can use : formik in later part 
--> implement avtar uploading & preview : using MUI component : Avatar & Stack
*/






/* Home Page : 
--> wrap in AppLayout L : for header , footer and title change etc...
--> in AppLayout : pass children as props for Home Page | display tile , header, footer

*/
// used in profile section in AppLayout: 
import moment from "moment"; // for data : from to To 
<ProfileCard
  heading={"Joined"}
  text={moment("2025-08-04T18:30:00.000Z").fromNow()}
  Icon={<CalendarIcon />}
/>;



// --------------------------------------------------------------------------------------
<div onContextMenu={(e) => e.preventDefault()}>
        <App />
</div> // This is to prevent right click on page 
  
  
// memo : used for performance optimization 
  // --> if parent component re-render but props did't change then child component will not re-render again (if used memo) 
import {memo} from "react";
/*export default*/ memo(MessageComponent);

// useRef: used to access dom elements for reference element : 
// useCallback : to make function prevent from re-renders unless the dependencies change.
// memo : to prevent component re-render until props changed 
// lazy : to prevent unwanted components loading : only nessary components will be loaded.




// Env file in frontend : 
export const server = import.meta.env.VITE_SERVER; // set this in any file like config.js 
// now we don't need to configure dotenv as it is already configured : 
// --> now we can set server url : VITE_SERVER=http://localhost:3000 in .env file 

// how to use : 
import {server} from "./constants/config.js";
console.log(server); // http://localhost:3000 





// Server : 

// safer way to define model for insure overwridden schema : 
const User = mongoose.models.User || mongoose.model("User", userSchema);




// framer motion : 
import { motion } from "framer-motion";





// Deployment : in vercel for reloading then give error that why we use this by creating any file like : vercel.json(outside of src foler)
// {
//   "rewrites":[{"source": "/(.*)", "destination": "/index.html"}]
// }
