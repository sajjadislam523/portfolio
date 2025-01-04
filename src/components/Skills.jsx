import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    FaCss3Alt,
    FaGitAlt,
    FaHtml5,
    FaNodeJs,
    FaReact,
} from "react-icons/fa";
import { SiJavascript, SiMongodb, SiTailwindcss } from "react-icons/si";

const Skills = () => {
    const skills = [
        {
            id: 1,
            icon: <FaReact className="text-4xl text-blue-500" />,
            name: "React",
            description: "Frontend framework for building interactive UIs.",
            proficiency: "90%",
        },
        {
            id: 2,
            icon: <SiJavascript className="text-4xl text-yellow-500" />,
            name: "JavaScript",
            description: "Language for building web applications.",
            proficiency: "85%",
        },
        {
            id: 3,
            icon: <FaNodeJs className="text-4xl text-green-500" />,
            name: "Node.js",
            description: "Backend runtime for scalable applications.",
            proficiency: "80%",
        },
        {
            id: 4,
            icon: <SiMongodb className="text-4xl text-green-600" />,
            name: "MongoDB",
            description: "NoSQL database for modern web applications.",
            proficiency: "75%",
        },
        {
            id: 5,
            icon: <FaHtml5 className="text-4xl text-orange-500" />,
            name: "HTML5",
            description: "Markup language for structuring web content.",
            proficiency: "95%",
        },
        {
            id: 6,
            icon: <FaCss3Alt className="text-4xl text-blue-400" />,
            name: "CSS3",
            description: "Stylesheet language for designing websites.",
            proficiency: "90%",
        },
        {
            id: 7,
            icon: <SiTailwindcss className="text-4xl text-blue-600" />,
            name: "Tailwind CSS",
            description: "Utility-first CSS framework for styling.",
            proficiency: "85%",
        },
        {
            id: 8,
            icon: <FaGitAlt className="text-4xl text-orange-500" />,
            name: "Git",
            description: "Version control system for collaboration.",
            proficiency: "85%",
        },
    ];

    return (
        <section id="skills" className="py-16">
            <div className="container px-6 mx-auto md:px-12 lg:px-20">
                <h2 className="text-3xl font-bold text-start font-poppins">
                    My Skills
                </h2>
                <p className="mt-2 text-gray-600 text-start font-inter">
                    Here’s a quick overview of the skills I’ve acquired and
                    continuously improve, showcasing my technical proficiency.
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: skill.id * 0.1,
                            }}
                        >
                            <Card className="p-4 shadow-lg hover:shadow-xl">
                                <CardHeader className="flex items-center justify-center">
                                    {skill.icon}
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-center">
                                        {skill.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-center">
                                        {skill.description}
                                    </CardDescription>
                                    <div className="w-full h-2 mt-4 bg-gray-200 rounded-full">
                                        <motion.div
                                            className="h-2 bg-blue-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: skill.proficiency,
                                            }}
                                            transition={{ duration: 1 }}
                                            style={{ width: skill.proficiency }}
                                        ></motion.div>
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-center text-gray-600">
                                        {skill.proficiency}
                                    </p>
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
