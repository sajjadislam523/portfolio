import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const mobileMenuVariants = {
        hidden: { y: "-100%", opacity: 0 },
        visible: {
            y: "-2.8%",
            opacity: 1,
            transition: { duration: 0.6, ease: "easeInOut" },
        },
        exit: {
            y: "-100%",
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" },
        },
    };

    const menuItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.4 },
        }),
    };

    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <motion.nav
            className="sticky z-50 flex items-center mx-auto bg-gray-100 border rounded-full shadow-md max-w-7xl bg-opacity-90 top-5"
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between w-full px-10 py-4">
                {/* Logo */}
                <Link
                    to="hero"
                    smooth={true}
                    offset={-80}
                    className="flex gap-1 text-2xl font-medium cursor-pointer font-poppins"
                >
                    Sajjad
                </Link>

                {/* Desktop Menu */}
                <div className="items-center hidden space-x-8 lg:flex font-inter">
                    <Link
                        to="about"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        About
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="education"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Education
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="skills"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Skills
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="projects"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Projects
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="contact"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Contact
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Button
                        asChild
                        variant="outline"
                        className="uppercase transition-all duration-500 ease-[cubic-bezier(0.33, 1, 0.68, 1)] rounded-full hover:bg-black hover:text-white"
                    >
                        <a
                            href="https://docs.google.com/document/d/1ij98kj5DNQP1By-JiZz0Ko1rZ9_pi6MiEw9aLgaINdQ/edit?usp=sharing"
                            target="_blank"
                        >
                            Resume
                        </a>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="z-50 lg:hidden">
                    <Button
                        variant="outline"
                        className="bg-gray-100 "
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-screen bg-white rounded-lg shadow-md lg:hidden"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-12 py-4 font-inter">
                            {["about", "skills", "projects", "contact"].map(
                                (section, index) => (
                                    <motion.div
                                        key={section}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index}
                                    >
                                        <Link
                                            to={section}
                                            smooth={true}
                                            offset={-80}
                                            className="relative duration-500 ease-in-out cursor-pointer group"
                                            onClick={toggleMobileMenu}
                                        >
                                            {section.charAt(0).toUpperCase() +
                                                section.slice(1)}
                                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
