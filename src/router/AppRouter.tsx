import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import Login from "../pages/login/login";
import EventList from "../pages/events/eventList";
import RegisterEvent from "../pages/events/registerEvent";


const PrivateRoute = ({children}: {children: JSX.Element}) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children: <Navigate to="/login"/>
}

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/events" element={<PrivateRoute><EventList/></PrivateRoute>} />
                <Route path="/events/register" element={<PrivateRoute><RegisterEvent/></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/events" />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
