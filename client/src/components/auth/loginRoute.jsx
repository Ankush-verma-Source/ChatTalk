import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function LoginRoute({ children , redirect="/"}) {

    const {isAuthenticated }= useSelector(state => state.auth);

    if(!isAuthenticated) return children;
    else {
        return <Navigate to={redirect} />
    }
}