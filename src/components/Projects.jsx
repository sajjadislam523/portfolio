const Projects = () => {
    const projects = [
        {
            title: "Project 1",
            description: "A brief description of the project.",
            liveLink: "#",
            github: "#",
            tech: ["React", "TailwindCSS"],
        },
        // Add more projects...
    ];

    return (
        <section id="projects" className="py-16">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-8 text-3xl font-bold text-center">
                    Projects
                </h2>
                {/* <div className="grid gap-8 md:grid-cols-3">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div> */}
            </div>
        </section>
    );
};

export default Projects;
