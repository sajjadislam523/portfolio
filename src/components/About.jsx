import { motion } from "framer-motion";
import aboutMe from "../assets/Myself.jpg";

const About = () => {
    return (
        <section id="about" className="py-16 bg-gray-100">
            <div className="container px-6 mx-auto text-center md:px-12 lg:px-20 md:text-left">
                {/* Heading */}
                <motion.h2
                    className="mb-8 text-4xl font-bold text-gray-800 text-start font-poppins"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    About Me
                </motion.h2>

                <div className="items-center md:flex md:gap-12">
                    {/* Left Side: Image */}
                    <motion.div
                        className="flex-shrink-0 mb-8 md:mb-0 md:w-1/3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <img
                            src={aboutMe}
                            alt="Sajjad"
                            className="w-64 h-auto mx-auto rounded-lg shadow-lg md:mx-0"
                        />
                    </motion.div>

                    {/* Right Side: Description */}
                    <motion.div
                        className="text-gray-700 md:w-2/3 text-start"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {/* Hobby and Personal Interests */}
                        <p className="mb-6 text-lg leading-relaxed font-inter">
                            Hi, I’m{" "}
                            <span className="text-2xl font-semibold text-gray-800">
                                Sajjadul Islam
                            </span>
                            , a passionate Frontend Developer who loves crafting
                            beautiful and user-friendly digital experiences.
                            Beyond coding, I enjoy{" "}
                            <span className="text-blue-600">
                                traveling, exploring photography,
                            </span>{" "}
                            and staying updated with the latest tech trends.
                        </p>

                        {/* How You Came into Development */}
                        <p className="mb-6 text-lg leading-relaxed font-inter">
                            My love for computers began in my childhood, and
                            that fascination gradually evolved into an interest
                            in programming. As I started exploring the world of
                            development, I found myself captivated by the
                            endless possibilities of creating innovative
                            solutions. This journey has been one of constant
                            learning and growth, pushing me to become a better
                            developer every day.
                        </p>

                        {/* Life Story */}
                        <p className="mb-6 text-lg leading-relaxed font-inter">
                            From tinkering with gadgets to building interactive
                            web applications, my life has been a mix of
                            curiosity and creativity. Each step along the way
                            has shaped me into the person I am today—a developer
                            with a deep passion for technology and a drive to
                            make a positive impact through my work.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
