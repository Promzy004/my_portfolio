import { useState } from "react";
import ProjectCard from "../PageComponents/Projects/ProjectCard";
import { projects } from "../../data/Projects";
import { AnimatePresence, motion } from "framer-motion";

const DevelopmentProjects = ({darkMode}: {darkMode: boolean}) => {

    const stacks: string[] = ['Front-End Development', 'Back-End Development', 'Full-Stack Development']

    const [ activeStack, setActiveStack ] = useState<string>('Front-End Development')

    const filteredProjects = projects.filter(project => project.stack === (activeStack.split(' ')[0]))

    return (
        <div className="max-w-screen-xl lg:w-[1024px] mx-auto py-10 sm:px-7 flex flex-col w-full gap-10">
            {/* stacks */}
            <div className="inline-flex md:justify-center w-full overflow-x-auto hide-scrollbar scroll-smooth px-6">
                <div className="flex gap-3 md:gap-5 justify-center">
                    {stacks.map((stack, index) => (
                        <button
                            key={index}
                            className={`w-max rounded-full px-5 py-2 font-semibold text-sm backdrop-blur-md transition-all duration-500 ${activeStack === stack ? 'bg-primary text-white dark:bg-primary' : 'bg-[#EAEAEA] dark:bg-[#302F2F] hover:bg-primary hover:text-white hover:dark:bg-primary'}`}
                            onClick={() => setActiveStack(stack)}
                            style={{
                                boxShadow: `${activeStack === stack ? "inset -4px -4px 4px 0 rgba(255, 255, 255, 0.30), inset 4px 4px 4px 0 rgba(255, 255, 255, 0.20)" : darkMode ? "-4px -4px 4px 0 rgba(255, 255, 255, 0.05) inset, 4px 4px 4px 0 rgba(255, 255, 255, 0.05) inset" : "-4px -4px 4px 0 rgba(0, 0, 0, 0.05) inset, 4px 4px 4px 0 rgba(0, 0, 0, 0.05) inset"}`
                            }}
                        >
                            {stack}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* projects */}
            <div className="flex flex-col gap-8 sm:gap-12 px-4">
                <AnimatePresence mode="wait">
                    <div>
                        <motion.h2 
                            className="text-3xl xs:text-4xl md:text-5xl font-black mb-2"
                            key={activeStack + "-title"}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.5 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {activeStack.split(' ')[0]} Projects
                        </motion.h2>
                        <motion.p 
                            className="text-base sm:text-lg"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            I'm a full stack developer. I've been a fanatic of computers since time immemorial, and i loved math (I can't figure out why I don't love it anymore). Anyways, i wrote my first line of code in 2019! thanks to zuck. I'm a yapper and introvert who writes less, so here is my blog . I hope i soon talk less and write more!
                        </motion.p>
                    </div>
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                    {filteredProjects.length > 0 ?
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10"
                            key={activeStack}
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
                                        text="See designer for this job"
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
                            No project for {(activeStack.split('-').join(' ')).toLocaleLowerCase()} at this moment ...
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}

export default DevelopmentProjects;