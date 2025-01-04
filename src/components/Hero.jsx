import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import profile from "../assets/profile.jpg";

export default function Hero() {
    return (
        <section
            id="hero"
            className="flex flex-col items-center min-h-screen md:justify-between md:flex-row"
        >
            <div className="p-4 mt-4 md:w-1/2">
                <p className="text-xl font-inter">Hello, I&apos;am Sajjad!</p>
                <h1 className="text-4xl font-bold font-poppins">
                    Turning <span className="italic font-bodoni">Ideas</span>{" "}
                    into Impactful Digital Solutions
                </h1>
                <p className="mt-4 text-lg font-inter">
                    I’m a MERN stack developer passionate about building
                    scalable and user-friendly web applications. Using MongoDB,
                    Express.js, React, and Node.js, I transform ideas into
                    intuitive and efficient solutions.
                </p>
                <p className="mt-4 text-sm italic font-poppins">
                    Let’s shape the future—one line of code at a time.
                </p>
                <div className="flex mt-6 space-x-4">
                    <Link
                        to="https://www.linkedin.com/in/sajjadul-islam-910b35227"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaLinkedin className="text-2xl text-blue-500" />
                    </Link>
                    <Link
                        to="https://github.com/sajjadislam523"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub className="text-2xl text-gray-800" />
                    </Link>
                    <Link
                        to="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaFacebook className="text-2xl text-blue-400" />
                    </Link>
                    <Link
                        to="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaInstagram className="text-2xl text-blue-400" />
                    </Link>
                </div>
            </div>

            <div className="flex justify-center w-full p-4 md:w-1/2">
                <img
                    src={profile}
                    alt="Profile"
                    className="object-cover rounded-md h-72 w-60"
                />
            </div>
        </section>
    );
}
