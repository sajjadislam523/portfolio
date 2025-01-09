import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Footer = () => {
    return (
        <footer className="py-6 h-[18rem] border-t border-gray-300">
            <div className="flex flex-col items-center justify-center gap-12 text-center">
                {/* Website Name */}
                <div>
                    <h2 className="text-3xl font-medium cursor-pointer font-poppins">
                        Sajjad
                    </h2>
                </div>

                {/* Social Icons */}
                <div className="flex gap-6">
                    <Link
                        to="www.linkedin.com/in/sajjadislam523"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition hover:text-black"
                    >
                        <FaLinkedin className="text-2xl" />
                    </Link>
                    <Link
                        to="https://github.com/sajjadislam523"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition hover:text-black"
                    >
                        <FaGithub className="text-2xl" />
                    </Link>
                    <Link
                        to="mailto:sajjad.islam523@gmail.com"
                        className="text-gray-600 transition hover:text-black"
                    >
                        <FaEnvelope className="text-2xl" />
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-8 font-inter">
                    <ScrollLink
                        to="about"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        About
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </ScrollLink>
                    <ScrollLink
                        to="education"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Education
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </ScrollLink>
                    <ScrollLink
                        to="skills"
                        smooth={true}
                        offset={-80}
                        className="relative duration-500 ease-in-out cursor-pointer group"
                    >
                        Skills
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </ScrollLink>
                </div>

                {/* Copyright Text */}
                <p className="text-sm text-gray-500 font-inter">
                    &copy; {new Date().getFullYear()} Sajjad. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
