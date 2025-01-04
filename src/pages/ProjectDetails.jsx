import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // Import Framer Motion
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        <div className="container py-12 mx-auto">
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
                <div className="flex items-center mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Button
                            as="a"
                            href={project?.liveURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105"
                        >
                            Live Project
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <Button
                            as="a"
                            href={project?.githubFrontend}
                            target="_blank"
                            variant="outline"
                            rel="noopener noreferrer"
                            className="px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105"
                        >
                            GitHub Frontend
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <Button
                            as="a"
                            href={project?.githubBackend}
                            target="_blank"
                            variant="outline"
                            rel="noopener noreferrer"
                            className="px-4 py-2 transition-transform transform rounded-full sm:px-6 hover:scale-105"
                        >
                            GitHub Backend
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
            </div>
        </div>
    );
};

export default ProjectDetails;
