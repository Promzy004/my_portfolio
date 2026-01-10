import ProjectCard from "../components/PageComponents/Projects/ProjectCard";
import { projects } from "../data/Projects";
import { AnimatePresence, motion } from "framer-motion";

const MobileProjects = ({darkMode}: {darkMode: boolean}) => {

    const filteredProjects = projects.filter(project => (project.category).toLowerCase() === "mobile")

    return (
        <div className="max-w-screen-xl lg:w-[1024px] mx-auto py-10 sm:px-7 flex flex-col w-full gap-10">
            {/* projects */}
            <div className="flex flex-col gap-8 sm:gap-12 px-4">
                <div>
                    <motion.h2 
                        className="text-3xl xs:text-4xl md:text-5xl font-black mb-3"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        Projects
                    </motion.h2>
                    <motion.p 
                        className="text-base sm:text-lg"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        Mobile apps I've created to bring ideas to life on the go. Each project showcases different features and solutions I've experimented with. Take a look around.
                    </motion.p>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    {filteredProjects.length > 0 ?
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <ProjectCard 
                                        darkMode={darkMode} 
                                        projectImage={project.image} 
                                        projectName={project.name} 
                                        projectDate={project.date} 
                                        projectTags={project.tags} 
                                        projectLink={project.link} 
                                        projectDesc={project.desc} 
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                        :
                        <motion.div
                            key="no-projects"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            No project at this moment ...
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}

export default MobileProjects;