import { Outlet } from "react-router-dom";
import Navbar from "./../components/Navbar";

const Layout = () => {
    return (
        <div className="px-12 bg-gray-100">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Layout;
