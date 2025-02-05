import { motion } from "framer-motion";

const Education = () => {
    return (
        <motion.section
            id="education"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container flex flex-col items-center min-h-screen px-6 py-16 mx-auto mt-8 md:px-12 lg:px-20"
        >
            <div className="w-full">
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="text-3xl font-bold text-black font-poppins"
                >
                    Education
                </motion.h2>
                <p className="mt-4 text-lg text-gray-700 font-inter">
                    A detailed overview of my educational journey, highlighting
                    key milestones and ongoing pursuits.
                </p>

                {/* Timeline */}
                <div className="relative mt-12">
                    {/* Vertical line for timeline */}
                    <div className="absolute inset-0 w-1 h-full bg-gray-300 left-8 md:left-12"></div>

                    {/* Timeline Items */}
                    <div className="space-y-16">
                        {/* Timeline Item 1 */}
                        <div className="flex flex-col items-start md:flex-row md:items-center">
                            {/* Circle */}
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 text-white bg-black rounded-full shadow-md">
                                <span className="text-base font-bold">1</span>
                            </div>
                            <div className="mt-4 ml-16 md:mt-0">
                                <h3 className="text-xl font-semibold text-black md:text-2xl font-poppins">
                                    Bachelor of Science in Computer Science &
                                    Engineering
                                </h3>
                                <p className="mt-2 text-gray-700 font-poppins">
                                    The Peoples University of Bangladesh
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Graduation Year: 2024
                                </p>
                                <p className="mt-3 text-gray-600 font-inter">
                                    During my bachelor&apos;s, I focused on
                                    developing a strong foundation in computer
                                    science concepts, programming, and
                                    problem-solving. My key projects included
                                    creating an e-commerce website and a machine
                                    learning model for predicting stock market
                                    trends.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:flex-row md:items-center">
                            {/* Circle */}
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 text-white bg-gray-600 rounded-full shadow-md">
                                <span className="text-base font-bold">2</span>
                            </div>
                            {/* Content */}
                            <div className="mt-4 ml-16 md:mt-0">
                                <h3 className="text-xl font-semibold text-black md:text-2xl font-poppins">
                                    Front-End Web Development (Ongoing)
                                </h3>
                                <p className="mt-2 text-gray-700 font-inter">
                                    Programming Hero
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Started: 2024
                                </p>
                                <p className="mt-3 text-gray-600 font-inter">
                                    I&apos;m currently learning modern front-end
                                    development practices, including HTML5,
                                    CSS3, JavaScript, React.js, and Tailwind
                                    CSS. Programming Hero provides a hands-on
                                    approach to learning, with projects such as
                                    responsive websites, e-commerce apps, and
                                    REST API integrations.
                                </p>
                                <ul className="mt-4 text-gray-600 list-disc list-inside font-inter">
                                    <li>Responsive Design Principles</li>
                                    <li>Reusable Components with React</li>
                                    <li>API Handling and State Management</li>
                                    <li>Deploying Web Applications</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Education;
