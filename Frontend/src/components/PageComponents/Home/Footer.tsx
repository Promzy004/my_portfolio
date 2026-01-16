import * as Icons from "../Home/svgIcons";

interface ISocialHandles {
    social: string,
    link: string,
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    ariaLabel: string; // Added for accessibility
}

const socialHandles: ISocialHandles[] = [
    {
        social: 'Mail',
        link: 'promiseedwin242@gmail.com',
        icon: Icons.Mail,
        ariaLabel: 'Email Edwin Promise - Full-Stack Developer'
    },
    {
        social: 'LinkendIn',
        link: 'https://www.linkedin.com/in/edwin-promise-a73b822b6/',
        icon: Icons.LinkendIn,
        ariaLabel: 'Edwin Promise LinkedIn - Full-Stack Web Developer profile'
    },
    {
        social: 'Github',
        link: 'https://github.com/Promzy004',
        icon: Icons.Github,
        ariaLabel: 'Edwin Promise GitHub - Web development projects and code'
    },
    {
        social: 'TikTok',
        link: '',
        icon: Icons.TikTok,
        ariaLabel: 'Edwin Promise TikTok'
    },
    {
        social: 'Twitter',
        link: 'https://x.com/promzy_004',
        icon: Icons.Twitter,
        ariaLabel: 'Edwin Promise Twitter/X - Developer insights and updates'
    },
]


const Footer = ({ darkMode } : { darkMode: boolean }) => {
    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex gap-4 sm:gap-6" role="list" aria-label="Social media links">
                {socialHandles.map((social, index) => {
                    // Skip rendering if link is empty (TikTok)
                    if (!social.link) return null;
                    
                    return (
                        <a 
                            key={index}
                            role="listitem"
                            aria-label={social.ariaLabel}
                            className="w-max z-50 rounded-2xl p-[10px] border-[1px] bg-[#FFFFFF33] border-[#888888] dark:bg-[#302F2FB2] dark:border-[#888888] backdrop-blur-md"
                            style={{
                                boxShadow: `${darkMode ? "-3.111px -3.111px 3.111px 0 rgba(255, 255, 255, 0.20) inset, 3.111px 3.111px 3.111px 0 rgba(255, 255, 255, 0.05) inset" : "-3.111px -3.111px 3.111px 0 rgba(0, 0, 0, 0.20) inset, 3.111px 3.111px 3.111px 0 rgba(0, 0, 0, 0.20) inset"}`
                            }}
                            href={social.social === "Mail" ? `mailto:${social.link}` : social.link}
                            target={social.social === "Mail" ? "_self" : "_blank"}
                            rel={social.social === "Mail" ? undefined : "noopener noreferrer"}
                        >
                            <social.icon className='w-5 h-5 sm:w-6 sm:h-6' aria-hidden="true" />
                        </a>
                    );
                })}
            </div>
            <p className="text-xs sm:text-sm font-medium"> &copy; {new Date().getFullYear()} Edwin Promise </p>
        </div>
    );
}
 
export default Footer;