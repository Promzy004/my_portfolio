import type React from "react";

interface ProjectCardProps {
    darkMode: boolean
    projectName: string,
    projectDate: string,
    projectImage: string,
    projectTags: string[]
    projectLink: string
    projectDesc?: string
}

const ProjectCard: React.FC <ProjectCardProps> = ({darkMode, projectImage, projectName, projectDate, projectTags, projectLink, projectDesc }) => {
    return (
        <div className="relative overflow-hidden h-[420px] w-full rounded-[20px] bg-white drop-shadow-sm">

            {/* project image */}
            <div className="h-[180px] sm:h-[50%] cursor-pointer overflow-hidden bg-primary">
                <img                     
                    src={projectImage}
                    alt={`image of ${projectName} project`}
                    loading="lazy" 
                    className="w-full h-full object-cover object-top transition-all duration-500 hover:scale-105" 
                />
            </div>

            {/* project details */}
            <div className="dark:bg-[#111] flex flex-col justify-between h-[50%] px-6 pt-8 pb-6">
                <div>
                    <div className="flex gap-5 justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg sm:text-xl font-extrabold">{projectName}</h3>
                            <p className="text-xs font-normal">{projectDate}</p>
                        </div>
                        <a 
                            className="flex gap-3 items-center bg-primary px-4 sm:px-5 py-[7px] rounded-full"
                            style={{ 
                                background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                                boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                            }}
                            href={projectLink}
                            target="_blank"
                        >
                            <span className="text-sm sm:text-base text-white">View</span>
                            <ViewIcon />
                        </a>

                    </div>

                    <p className="font-normal text-sm break-words clamp-3 mt-10">{projectDesc}</p>
                </div>

                
                {/* tags */}
                <div className="flex flex-wrap gap-3">
                    {projectTags.map((tag, index) => (
                        <span 
                            key={index}
                            className="bg-[#E1E5E8] dark:bg-[#302F2F] rounded-[12px] text-xs font-normal px-3 py-1"
                            style={{
                                boxShadow: `${darkMode ? "-4px -4px 4px 0 rgba(255, 255, 255, 0.05) inset, 4px 4px 4px 0 rgba(255, 255, 255, 0.05) inset" : "-4px -4px 4px 0 rgba(0, 0, 0, 0.05) inset, 4px 4px 4px 0 rgba(0, 0, 0, 0.05) inset"}`
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}


const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-5" viewBox="0 0 22 19" fill="none">
        <path d="M20 0.5H5C4.46957 0.5 3.96086 0.710714 3.58579 1.08579C3.21071 1.46086 3 1.96957 3 2.5V8.5H7V6.5L11 9.5L7 12.5V10.5H3V16.5C3 17.0304 3.21071 17.5391 3.58579 17.9142C3.96086 18.2893 4.46957 18.5 5 18.5H20C20.5304 18.5 21.0391 18.2893 21.4142 17.9142C21.7893 17.5391 22 17.0304 22 16.5V2.5C22 1.96957 21.7893 1.46086 21.4142 1.08579C21.0391 0.710714 20.5304 0.5 20 0.5ZM17 14.5H13V12.5H17V14.5ZM20 10.5H13V8.5H20V10.5ZM20 6.5H13V4.5H20V6.5ZM3 10.5H0V8.5H3V10.5Z" fill="white"/>
    </svg>
)
 
export default ProjectCard;