import { Outlet } from "react-router-dom";
import Navbar from "./../components/Navbar";

const Layout = () => {
    return (
        <div className="bg-gray-100 ">
            <Navbar />
            <div className="px-12">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
