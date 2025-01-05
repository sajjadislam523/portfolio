import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // Import Framer Motion
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch("/projectsData.json")
            .then((response) => response.json())
            .then((data) => {
                const foundProject = data.find(
                    (project) => project.id === Number(id)
                );
                if (foundProject) {
                    setProject(foundProject);
                } else {
                    setProject(null);
                }
            })
            .catch((error) => console.error("Error:", error));
    }, [id]);

    return (
        <div className="container px-4 py-12 mx-auto">
            {/* Project Image with animation */}
            <motion.div
                className="flex justify-center p-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <img
                    src={project?.image}
                    alt={project?.projectName}
                    className="object-cover w-full max-w-3xl p-8 rounded-lg shadow-lg h-96"
                />
            </motion.div>

            {/* Project Name under the Image with animation */}
            <motion.h2
                className="mb-6 text-3xl font-bold text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {project?.projectName}
            </motion.h2>

            <div className="mt-6">
                <p className="text-gray-600">{project?.description}</p>

                {/* Links with animation */}
                <div className="flex items-center gap-2 mt-4 sm:flex-row">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Button
                            asChild
                            className="px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105"
                        >
                            <Link
                                to={project?.liveURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Live Project
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <Button
                            asChild
                            variant="outline"
                            className="px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105"
                        >
                            <Link
                                to={project?.githubFrontend}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub Frontend
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <Button
                            asChild
                            variant="outline"
                            disabled={!project?.githubBackend}
                            className={`px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105 ${
                                !project?.githubBackend
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                            }`}
                        >
                            <Link
                                to={project?.githubBackend || "#"}
                                target={
                                    project?.githubBackend
                                        ? "_blank"
                                        : undefined
                                }
                                rel="noopener noreferrer"
                            >
                                GitHub Backend
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Technologies with animation */}
                {project?.technologies &&
                    Array.isArray(project?.technologies) && (
                        <motion.div
                            className="flex flex-wrap gap-2 mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            {project.technologies.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-xs text-black border border-gray-900 rounded-full sm:text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </motion.div>
                    )}

                {project?.features && Array.isArray(project?.features) && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        <h3 className="mb-4 text-xl font-semibold">
                            Key Features:
                        </h3>
                        <ul className="pl-4 space-y-2 text-gray-700 list-disc">
                            {project.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
