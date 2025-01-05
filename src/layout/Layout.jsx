import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "./../components/Navbar";

const Layout = () => {
    return (
        <div className="px-2 bg-gray-100">
            <Navbar />
            <div className="md:px-12">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
