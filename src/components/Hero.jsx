import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import profile from "../assets/profile.jpg";

export default function Hero() {
    return (
        <motion.section
            id="hero"
            className="container flex flex-col items-center min-h-screen px-6 mx-auto md:px-12 lg:px-20 md:justify-between md:flex-row"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="p-4 mt-4 md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
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
                <motion.div
                    className="flex mt-6 space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link
                            to="https://www.linkedin.com/in/sajjadul-islam-910b35227"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaLinkedin className="text-2xl " />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link
                            to="https://github.com/sajjadislam523"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaGithub className="text-2xl " />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link
                            to="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaFacebook className="text-2xl " />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Link
                            to="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaInstagram className="text-2xl" />
                        </Link>
                    </motion.div>
                </motion.div>
                <div className="flex mt-4 lg:hidden">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            ease: "easeInOut",
                            duration: 0.4,
                        }}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="flex mt-4 lg:hidden"
                    >
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
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                className="flex justify-center w-full p-4 md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <img
                    src={profile}
                    alt="Profile"
                    className="object-cover rounded-md h-72 w-60"
                />
            </motion.div>
        </motion.section>
    );
}
