import React, { useEffect, useState } from "react";
import { CVIcon, HomeIcon, AboutIcon, CancelIcon, DevelopmentIcon, DesignIcon } from "../../PageComponents/Home/svgIcons";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface NavigationProps {
    darkMode: boolean
}

interface INavLinks {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    path: string,
    label: string  // Added for accessibility
}

const Navigation: React.FC<NavigationProps> = ({ darkMode }) => {

    const [ showNav, setShowNav ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    const navLinks: INavLinks[] = [
        {
            icon: HomeIcon,
            path: '/',
            label: 'Home'
        },
        {
            icon: AboutIcon,
            path: '/about',
            label: 'About'
        },
        {
            icon: DevelopmentIcon,
            path: '/web-projects',
            label: 'Web Projects'
        },
        {
            icon: DesignIcon,
            path: '/mobile-app-projects',
            label: 'Mobile App Projects'
        },
        {
            icon: CVIcon,
            path: '/cv',
            label: 'CV'
        },
    ]

    // define what paths should be allowed for each page, to determine the nav icons to 
    // for each page
    let allowedPaths: string[] = [];
    switch (currentPath) {
        case "/":
            allowedPaths = ['/about', '/web-projects', '/cv']
            break;
        case '/about':
            allowedPaths = ['/', '/cv', '/web-projects']
            break;
        case '/web-projects':
            allowedPaths = ['/', '/about', '/mobile-app-projects']
            break;
        case '/mobile-app-projects':
            allowedPaths = ['/', '/about', '/web-projects']
            break;
        case '/cv':
            allowedPaths = ['/', '/about', '/web-projects']
            break;
        default:
            allowedPaths = []
    }

    //filter to decided what links to display
    const filteredLinks = navLinks.filter(link => {
        return allowedPaths.includes(link.path) && link.path !== currentPath;
    })

    //get active page so as to get active page icon
    const activePage = navLinks.find((link) => link.path === currentPath);
    const ActiveIcon = activePage?.icon || HomeIcon;
    const activeLabel = activePage?.label || 'Home';

    

    const handleNavLink = (url: string) => {
        setLoading(true)
        window.scrollTo(0, 0)
        navigate(url)
        setShowNav(false)
    }

    useEffect(() => {
        // whenever the location changes, stop loading
        setLoading(false);
    }, [location]);

    return (
        <>
            {/* background blur when nav links is active */}
            <AnimatePresence>
                {showNav && (
                    <motion.div 
                        className="absolute bg-black/20 dark:bg-black/30 0 z-30 w-screen h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNav(false)}
                    ></motion.div>
                )}
            </AnimatePresence>
            <div className="sticky z-40 top-[20px] xs:top-[25px] w-full h-full flex flex-col justify-center items-center">
                {/* nav links toggle button */}
                <button 
                    aria-label={showNav ? "Close navigation menu" : `Open navigation menu - Currently on ${activeLabel} page`}
                    aria-expanded={showNav}
                    className="w-[50px] h-[50px] flex justify-center items-center z-50 rounded-2xl p-[10px] border-[1px] bg-[#FFFFFF33] border-[#888888] dark:bg-[#302F2FB2] dark:border-[#888888] backdrop-blur-md"
                    style={{
                        boxShadow: `${darkMode ? "-3.111px -3.111px 3.111px 0 rgba(255, 255, 255, 0.10) inset, 3.111px 3.111px 3.111px 0 rgba(255, 255, 255, 0.10) inset" : "-3.111px -3.111px 3.111px 0 rgba(0, 0, 0, 0.10) inset, 3.111px 3.111px 3.111px 0 rgba(0, 0, 0, 0.10) inset"}`
                    }}
                    onClick={() => setShowNav(!showNav)}
                >
                    {loading ?
                        <svg
                            className="h-6 w-6 animate-spin text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                        :
                        <>
                            {showNav ? 
                                <CancelIcon className="w-5 h-5" aria-hidden="true" />
                                :
                                <ActiveIcon className="w-7 h-7" aria-hidden="true" />
                            }
                        </>
                    }
                </button>

                {/* nav links */}
                <AnimatePresence>
                    {showNav && (
                        <>
                            <motion.div 
                                role="navigation"
                                aria-label="Main navigation"
                                className="flex gap-10 sm:gap-20 z-40 absolute top-20 xs:top-24 rounded-3xl w-max py-[30px] px-6 border-[0.5px] dark:bg-[#FFFFFF1A] dark:border-[#FFFFFF33] backdrop-blur-sm"
                                style={{
                                    boxShadow: `${darkMode ? "-4px -4px 4px 0 rgba(255, 255, 255, 0.05) inset, 4px 4px 4px 0 rgba(255, 255, 255, 0.05) inset" : "0 1px 2px 0 rgba(0, 0, 0, 0.10), 0 -1px 2px 0 rgba(0, 0, 0, 0.10) inset;"}`,
                                    background: `${darkMode ? 'linear-gradient(120deg, rgba(160, 160, 160, 0.20) 2.46%, rgba(58, 58, 58, 0.20) 100%)' : 'linear-gradient(120deg, rgba(251, 251, 251, 0.70) 2.46%, rgba(226, 226, 226, 0.70) 100%)'}`
                                }}
                                initial={{ opacity: 0, y: '-110px' }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, type: 'tween', ease: 'easeInOut' }}
                                exit={{ opacity: 0, y: '-110px' }}
                            >
                                {filteredLinks.map((navlink, index) => (
                                    <button 
                                        key={index}
                                        aria-label={`Navigate to ${navlink.label}`}
                                        className="w-max rounded-2xl p-[10px] border-[1px] bg-[#FFFFFF33] border-[#888888] dark:bg-[#302F2FB2] dark:border-[#888888] backdrop-blur-md"
                                        style={{
                                            boxShadow: `${darkMode ? "-3.111px -3.111px 3.111px 0 rgba(255, 255, 255, 0.10) inset, 3.111px 3.111px 3.111px 0 rgba(255, 255, 255, 0.10) inset" : "-3.111px -3.111px 3.111px 0 rgba(0, 0, 0, 0.10) inset, 3.111px 3.111px 3.111px 0 rgba(0, 0, 0, 0.10) inset"}`
                                        }}
                                        onClick={() => handleNavLink(navlink.path)}
                                    >
                                        <navlink.icon className="w-7 h-7" aria-hidden="true" />
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
 
export default Navigation;