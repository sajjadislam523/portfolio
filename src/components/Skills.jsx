import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    FaCss3Alt,
    FaGitAlt,
    FaHtml5,
    FaNodeJs,
    FaReact,
} from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import {
    SiJavascript,
    SiMongodb,
    SiShadcnui,
    SiTailwindcss,
    SiVercel,
} from "react-icons/si";

const Skills = () => {
    const skills = [
        {
            id: 1,
            icon: <FaReact className="text-5xl text-blue-500" />,
            name: "React",
        },
        {
            id: 2,
            icon: <SiJavascript className="text-3xl text-yellow-500" />,
            name: "JavaScript",
        },
        {
            id: 3,
            icon: <FaNodeJs className="text-3xl text-green-500" />,
            name: "Node.js",
        },
        {
            id: 4,
            icon: <SiMongodb className="text-3xl text-green-600" />,
            name: "MongoDB",
        },
        {
            id: 5,
            icon: <FaHtml5 className="text-3xl text-orange-500" />,
            name: "HTML5",
        },
        {
            id: 6,
            icon: <FaCss3Alt className="text-3xl text-blue-400" />,
            name: "CSS3",
        },
        {
            id: 7,
            icon: <SiTailwindcss className="text-3xl text-blue-600" />,
            name: "Tailwind CSS",
        },
        {
            id: 8,
            icon: <FaGitAlt className="text-3xl text-orange-500" />,
            name: "Git",
        },
        {
            id: 9,
            icon: <IoLogoFirebase className="text-3xl text-orange-500" />,
            name: "Firebase",
        },
        {
            id: 10,
            icon: <SiShadcnui className="text-3xl" />,
            name: "ShadCN UI",
        },
        {
            id: 11,
            icon: <SiVercel />,
            name: "Vercel",
        },
    ];

    return (
        <section id="skills" className="py-16 bg-gray-50/50">
            <div className="container px-6 mx-auto md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <h2 className="text-3xl font-bold text-black text-start font-poppins">
                        Technical Stack
                    </h2>
                    <p className="max-w-2xl mt-4 text-lg text-gray-600 text-start font-inter">
                        Core technologies I work with to build modern web
                        experiences
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mt-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: skill.id * 0.05,
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.15 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 transition-opacity duration-150 opacity-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl group-hover:opacity-100" />
                            <Card className="relative flex flex-col items-center justify-center h-32 p-4 transition-all duration-150 border border-gray-200/80 hover:border-blue-200/90 bg-background/90 backdrop-blur-sm">
                                <CardHeader className="mb-1">
                                    <div className="p-2">{skill.icon}</div>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardTitle className="text-sm font-semibold font-poppins">
                                        {skill.name}
                                    </CardTitle>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
