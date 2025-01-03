import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="sticky z-50 flex items-center max-w-6xl mx-auto bg-gray-100 border rounded-full shadow-md bg-opacity-90 top-5">
            <div className="flex items-center justify-between w-full px-10 py-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex gap-1 text-2xl font-medium font-poppins"
                >
                    Sajjad
                </Link>

                {/* Desktop Menu */}
                <div className="items-center hidden space-x-8 lg:flex font-inter">
                    <Link
                        to="about"
                        smooth={true}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        About
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="skills"
                        smooth={true}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Skills
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="projects"
                        smooth={true}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Projects
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="contact"
                        smooth={true}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Contact
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Button
                        as={Link}
                        to="/resume.pdf"
                        download
                        variant="outline"
                        className="uppercase transition-all duration-500 ease-[cubic-bezier(0.33, 1, 0.68, 1)] rounded-full hover:bg-black hover:text-white"
                    >
                        Resume
                    </Button>
                </div>

                <div className="lg:hidden">
                    <Button
                        variant="outline"
                        className="bg-gray-100"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </Button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="absolute left-0 w-full bg-white rounded-lg shadow-md top-full lg:hidden">
                    <div className="flex flex-col items-center py-4 space-y-4 font-inter">
                        <Link
                            to="about"
                            smooth={true}
                            className="duration-500 ease-in-out cursor-pointer"
                            onClick={toggleMobileMenu}
                        >
                            About
                        </Link>
                        <Link
                            to="skills"
                            smooth={true}
                            className="duration-500 ease-in-out cursor-pointer"
                            onClick={toggleMobileMenu}
                        >
                            Skills
                        </Link>
                        <Link
                            to="projects"
                            smooth={true}
                            className="duration-500 ease-in-out cursor-pointer"
                            onClick={toggleMobileMenu}
                        >
                            Projects
                        </Link>
                        <Link
                            to="contact"
                            smooth={true}
                            className="duration-500 ease-in-out cursor-pointer"
                            onClick={toggleMobileMenu}
                        >
                            Contact
                        </Link>
                        <Button
                            as={Link}
                            to="/resume.pdf"
                            download
                            variant="outline"
                            className="uppercase transition-all duration-500 ease-[cubic-bezier(0.33, 1, 0.68, 1)] rounded-full hover:bg-black hover:text-white"
                            onClick={toggleMobileMenu}
                        >
                            Resume
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
