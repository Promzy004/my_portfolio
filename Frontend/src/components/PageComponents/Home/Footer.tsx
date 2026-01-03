
import * as Icons from "../Home/svgIcons";

interface ISocialHandles {
    social: string,
    link: string,
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const socialHandles: ISocialHandles[] = [
    {
        social: 'Mail',
        link: 'promiseedwin242@gmail.com',
        icon: Icons.Mail
    },
    {
        social: 'LinkendIn',
        link: '',
        icon: Icons.LinkendIn
    },
    {
        social: 'Github',
        link: '',
        icon: Icons.Github
    },
    {
        social: 'TikTok',
        link: '',
        icon: Icons.TikTok
    },
    {
        social: 'Twitter',
        link: '',
        icon: Icons.Twitter
    },
]


const Footer = ({ darkMode } : { darkMode: boolean }) => {
    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex gap-4 sm:gap-6">
                {socialHandles.map((social, index) => (
                    <a 
                        key={index}
                        className="w-max z-50 rounded-2xl p-[10px] border-[1px] bg-[#FFFFFF33] border-[#888888] dark:bg-[#302F2FB2] dark:border-[#888888] backdrop-blur-md"
                        style={{
                            boxShadow: `${darkMode ? "-3.111px -3.111px 3.111px 0 rgba(255, 255, 255, 0.20) inset, 3.111px 3.111px 3.111px 0 rgba(255, 255, 255, 0.05) inset" : "-3.111px -3.111px 3.111px 0 rgba(0, 0, 0, 0.20) inset, 3.111px 3.111px 3.111px 0 rgba(0, 0, 0, 0.20) inset"}`
                        }}
                        href={social.social === "Mail" ? `mailto:${social.link}` : social.link}
                        target={social.social === "Mail" ? "_self" : "_blank"}
                        rel={social.social === "Mail" ? undefined : "noopener noreferrer"}
                    >
                        <social.icon className='w-5 h-5 sm:w-6 sm:h-6' />
                    </a>
                ))}
            </div>
            <p className="text-xs sm:text-sm font-medium"> &copy; {new Date().getFullYear()} Edwin Promise </p>
        </div>
    );
}
 
export default Footer;