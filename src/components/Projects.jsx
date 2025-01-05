import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("projectsData.json")
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <section id="projects" className="py-16">
            <div className="container px-6 mx-auto md:px-12 lg:px-20">
                <h2 className="text-3xl font-bold text-start font-poppins">
                    Projects
                </h2>
                <p className="mt-2 text-gray-600 font-inter">
                    Explore my featured projects showcasing my technical
                    expertise.
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="bg-white rounded-lg shadow-lg "
                        >
                            {/* Card Header with Project Image */}
                            <CardHeader className="p-0">
                                <img
                                    src={project.image}
                                    alt={project.projectName}
                                    className="object-cover w-full h-48 rounded-t-lg"
                                />
                            </CardHeader>

                            {/* Card Content with Project Name and Description */}
                            <CardContent className="flex flex-col justify-between h-[150px] p-4">
                                <h3 className="text-lg font-semibold text-gray-800 font-poppins">
                                    {project.projectName}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 font-inter line-clamp-3">
                                    {project.description}
                                </p>
                            </CardContent>

                            {/* Card Footer with View Details Button */}
                            <CardFooter className="p-4">
                                <Button
                                    onClick={() =>
                                        navigate(`/project/${project.id}`)
                                    }
                                    className="w-full px-4 py-2 rounded-full"
                                    variant="outline"
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
