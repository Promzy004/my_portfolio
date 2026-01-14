import type React from "react"
import email_black from "../assets/svg/Home/email-black.svg"
import phone_black from "../assets/svg/Home/phone-black.svg"
import phone_white from "../assets/svg/Home/phone-white.svg"
import email_white from "../assets/svg/Home/email-white.svg"
import Footer from "../components/PageComponents/Home/Footer"
import DesktopHomeCard from "../components/PageComponents/Home/DesktopHomeCard"
import MobileHomeCard from "../components/PageComponents/Home/MobileHomeCard"
import SEO from "../components/SEO/SEO"
import { seoData } from "../data/SeoData"


interface HomeProps {
    darkMode: boolean
}


const Home: React.FC<HomeProps> = ({darkMode}) => {

    const stacks: string[] = ['Front-End Developer', 'Back-End Developer', 'Full-Stack Developer']
    const pageSEO = seoData.home

    return (
        <>
            <SEO { ...pageSEO } />
            <div className="layout flex flex-col gap-20">
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="font-black text-3xl xxs:text-4xl xs:text-5xl sm:text-6xl">Edwin Promise</h1>
                    <div className="flex flex-col gap-6 lg:w-[65%] items-center ">
                        <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 xxs:gap-4 sm:gap-5 items-center font-medium text-[10px] xs:text-sm sm:text-base">
                            <span className="flex gap-1 xxs:gap-2 sm:gap-3 justify-center items-center">
                                <img src={darkMode ? email_white : email_black} alt="Email icon" className="transition-all duration-500 w-4 xxs:w-5 sm:w-6" />
                                <p className="text-lg">promiseedwin242@gmail.com</p>
                            </span>
                            <div className="hidden sm:block h-5 sm:h-6 w-[1px] bg-[#888888]"></div>
                            <span className="hidden sm:flex gap-1 xxs:gap-2 sm:gap-3 justify-center items-center">
                                <img src={darkMode ? phone_white : phone_black} alt="Phone icon" className="transition-all duration-500 w-4 xxs:w-5 sm:w-6" />
                                <p className="text-lg">+234 7058149298</p>
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 xs:w-[80%]">
                            {stacks.map((stack, index) => (
                                <div
                                    key={index}
                                    className="w-max rounded-full px-5 py-1 xxs:px-6 xxs:py-[6px] sm:px-7 font-semibold text-xs xxs:text-[13px] xs:text-sm bg-[#EAEAEA] dark:bg-[#302F2F] backdrop-blur-md"
                                    style={{
                                        boxShadow: `${darkMode ? "-4px -4px 4px 0 rgba(255, 255, 255, 0.05) inset, 4px 4px 4px 0 rgba(255, 255, 255, 0.05) inset" : "-4px -4px 4px 0 rgba(0, 0, 0, 0.05) inset, 4px 4px 4px 0 rgba(0, 0, 0, 0.05) inset"}`
                                    }}
                                >
                                    {stack}
                                </div>
                            ))}
                        </div>
                        <DesktopHomeCard darkMode={darkMode} />
                        <MobileHomeCard darkMode={darkMode} />
                    </div>
                </div>
                <Footer darkMode={darkMode} />
            </div>
        </>
    );
}
 
export default Home;