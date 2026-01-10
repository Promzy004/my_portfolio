

import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion, useAnimation} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface IHomeProps {
    darkMode: boolean
}

const DesktopHomeCard: React.FC<IHomeProps> = ({darkMode}) => {

    const [ expand, setExpand ] = useState<boolean>(true);
    const [ isAnimating, setIsAnimating ] = useState<boolean>(false)
    const [ expandRight, setExpandRight ] = useState<boolean>(true);
    const conatinerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const navigate = useNavigate();

    const navigateTo = (path: string) => {
        navigate(path);
        window.scrollTo(0, 0);
    }

    const leftBox1Control = useAnimation()
    const leftBox2Control = useAnimation()
    const leftBox3Control = useAnimation()
    const rightBox1Control = useAnimation()
    const rightBox2Control = useAnimation()
    const rightBox3Control = useAnimation()

    // helper to read DOM width
    const getContainerWidth = () => {
        try {
            return conatinerRef.current?.getBoundingClientRect().width ?? 0;
        } catch {
            return 0;
        }
    };

    // --- measure and keep updated using ResizeObserver ---
    useEffect(() => {
        // initial measure after a tick (lets layout settle)
        const measure = () => setContainerWidth(getContainerWidth());
        // measure after mount (next frame)
        requestAnimationFrame(measure);

        // setup ResizeObserver for live updates
        const ro = new ResizeObserver(() => {
            measure();
        });
        if (conatinerRef.current) ro.observe(conatinerRef.current);

        // also update on window resize as fallback
        const onResize = () => measure();
        window.addEventListener("resize", onResize);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    // --- safe delay helper (already in your code but keep here) ---
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // --- updated handleLeftCardClick (only the parts that use container width changed) ---
    const handleLeftCardClick = useCallback(async (): Promise<void> => {
        if (isAnimating) return;
        setIsAnimating(true);

        try {
            if (expand) {
            await rightBox1Control.start({ opacity: 0, transition: { duration: 0.1 } });
            rightBox1Control.set({ display: "none" });

            await delay(1000);
            setExpand((p) => !p);

            leftBox1Control.start({ rotate: "0deg", transition: { delay: 0.4 } });
            await delay(1000);

            // get fresh width from ref (not stale state)
            let w = getContainerWidth();

            // if width is zero (rare), wait a moment and try again
            if (!w) {
                await delay(80);
                w = getContainerWidth();
            }

            // final guard
            if (!w) {
                console.warn("container width still 0 — animation will use fallback value of 300px");
                w = 300;
            }

            // compute target x positions based on the live width
            const oneThird = w / 3;

            await Promise.all([
                leftBox2Control.start({
                rotate: "0deg",
                x: oneThird + 3, // your desired offset
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.4 },
                }),
                leftBox3Control.start({
                rotate: "0deg",
                // use 2/3 for the third card so they occupy thirds of container
                x: oneThird * 2 + 6,
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.4 },
                }),
            ]);
            } else {
            // collapse logic (unchanged)
            await Promise.all([
                leftBox3Control.start({
                rotate: "0deg",
                x: 0,
                opacity: 0,
                transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.4 },
                }),
                leftBox2Control.start({
                rotate: "0deg",
                x: 0,
                opacity: 0,
                transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.4 },
                }),
            ]);

            await delay(1000);
            leftBox1Control.start({ rotate: "-7deg", transition: { delay: 0.4 } });
            await delay(700);
            setExpand((p) => !p);

            rightBox1Control.set({ display: "flex", opacity: 0 });
            await rightBox1Control.start({ opacity: 1, transition: { duration: 0.6 } });
            }
        } finally {
            setIsAnimating(false);
        }
    }, [expand, isAnimating]); // keep deps as you had


    const handleRightCardClick = useCallback(async (): Promise<void> => {
        const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

        if (isAnimating) return;
        if (!containerWidth) return; // prevent animation if container width not yet measured

        setIsAnimating(true);

        try {
            if (expandRight) {
            // Step 1: Hide left boxes
            await Promise.all([
                leftBox1Control.start({ opacity: 0, transition: { duration: 0.1 } }),
                leftBox2Control.start({ opacity: 0, transition: { duration: 0.1 } }),
                leftBox3Control.start({ opacity: 0, transition: { duration: 0.1 } }),
                leftBox1Control.set({ display: 'none' }),
                leftBox2Control.set({ display: 'none' }),
                leftBox3Control.set({ display: 'none' }),
            ]);

            leftBox1Control.set({ display: 'none' });
            leftBox2Control.set({ display: 'none' });
            leftBox3Control.set({ display: 'none' });

            await delay(1000);
            setExpandRight(false);

            // Step 2: Rotate the right box
            rightBox1Control.start({
                rotate: '0deg',
                transition: { delay: 0.4 },
            });

            await delay(1000);

            // Step 3: Animate out the two new cards using containerWidth
            await Promise.all([
                rightBox2Control.start({
                rotate: '0deg',
                x: containerWidth / 3 + 3, // 👈 each card takes 1/3 of container
                opacity: 1,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4,
                },
                }),
                rightBox3Control.start({
                rotate: '0deg',
                x: (containerWidth / 3) * 2 + 6, // 👈 2/3 of container width for third card
                opacity: 1,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4,
                },
                }),
            ]);
            } else {
            // Reverse animation
            await Promise.all([
                rightBox3Control.start({
                rotate: '0deg',
                x: 0,
                opacity: 0,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4,
                },
                }),
                rightBox2Control.start({
                rotate: '0deg',
                x: 0,
                opacity: 0,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4,
                },
                }),
            ]);

            await delay(1000);

            rightBox1Control.start({
                rotate: '7deg',
                transition: { delay: 0.4 },
            });

            await delay(700);
            setExpandRight(true);

            leftBox1Control.set({ display: 'flex', opacity: 0 });
            leftBox2Control.set({ display: 'flex', opacity: 0 });
            leftBox3Control.set({ display: 'flex', opacity: 0 });

            await Promise.all([
                leftBox1Control.start({
                opacity: 1,
                transition: { duration: 0.6 },
                }),
                leftBox2Control.start({
                opacity: expand ? 0 : 1,
                transition: { duration: 0.6 },
                }),
                leftBox3Control.start({
                opacity: expand ? 0 : 1,
                transition: { duration: 0.6 },
                }),
            ]);
            }
        } finally {
            setIsAnimating(false);
        }
        }, [expandRight, isAnimating, expand, containerWidth]);



    return (
        <div className="hidden md:block my-[30px] xxs:my-[40px] xs:my-[50px] w-full">
            <div 
                ref={conatinerRef}
                className={`flex py-3 justify-center transition-all duration-300 ${
                    expandRight ? "gap-[30px] xxs:gap-[40px] xs:gap-[50px]" : "gap-0"
                }`}
            >

                {/* Left cards here */}
                <div 
                    className={`relative ${!expand ? 'w-full': ''}`}
                >
                    <motion.div 
                        initial={{ rotate: '-7deg' }}
                        animate={leftBox1Control}
                        className="absolute top-0 left-0 z-20 flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform -rotate-[7deg]"
                        style={{ 
                            boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                            width: `${(containerWidth / 3) - 6}px`,
                        }}
                    >
                        <div 
                            className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                            style={{
                                boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                            }}
                        >
                            <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1753563404/f0250ad9330584cddba35df423e7d09cdc4b39d5_twouls.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                        </div>
                        <button 
                            className="flex justify-between items-center gap-3 py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                            style={{ 
                                background: `${expand ? 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)' : 'conic-gradient(from 91deg at 50.23% 49.23%, #B60E0E 37.51646250486374deg, #E30909 135.70844650268555deg, #B60E0E 222.439284324646deg, #E30909 320.4205298423767deg)'}`,
                                boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                            }}
                            onClick={handleLeftCardClick}
                        >
                            <span>About Me</span>
                            {expand ? <FaArrowRight /> : <MdOutlineClose className="text-xl" /> }
                        </button>
                    </motion.div>

                    <motion.div 
                        initial={{ rotate: '-7deg', opacity: 0 }}
                        animate={leftBox2Control}
                        className="absolute top-0 left-0 z-10 flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform -rotate-[7deg]"
                        style={{ 
                            boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                            width: `${(containerWidth / 3) - 6}px`,
                        }}
                    >
                        <div 
                            className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                            style={{
                                boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                            }}
                        >
                            <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1768085040/a5d7b2a9b05a518d58c239b1bc39a550a664ed05_jswjv8.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                        </div>
                        <button 
                            className="flex justify-between items-center py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                            style={{ 
                                background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                                boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                            }}
                            onClick={() => navigateTo('/about')}
                        >
                            <span>Me</span>
                            <FaArrowRight />
                        </button>
                    </motion.div>

                    <motion.div 
                        initial={{ rotate: '-7deg', opacity: 0 }}
                        animate={leftBox3Control}
                        className="flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform -rotate-[7deg]"
                        style={{ 
                            boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                            width: `${(containerWidth / 3) - 6}px`,
                        }}
                    >
                        <div 
                            className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                            style={{
                                boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                            }}
                        >
                            <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1768085040/db8fb204d05c82e0f4e8cf801c3ee747b0630d8b_ey71ho.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                        </div>
                        <button 
                            className="flex justify-between items-center py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                            style={{ 
                                background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                                boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                            }}
                            onClick={() => navigateTo('/cv')}
                        >
                            <span>CV</span>
                            <FaArrowRight />
                        </button>
                    </motion.div>
                </div>


                {/* Right cards here */}
                <AnimatePresence>
                    {expand && (
                        <div className={`relative ${!expandRight ? 'w-full': ''} `}>
                            <motion.div 
                                initial={{ opacity: 1, rotate: '7deg' }}
                                animate={rightBox1Control}
                                className="absolute top-0 left-0 z-20 flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform rotate-[7deg]"
                                style={{ 
                                    boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                                    width: `${(containerWidth / 3) - 6}px`,
                                }}
                            >
                                <div 
                                    className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                                    style={{
                                        boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                                    }}
                                >
                                    <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1753563404/6901011bb2147330146c0cbac33af1f211fef8a8_hmllcr.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                                </div>
                                <button 
                                    className="flex justify-between items-center gap-3 py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                                    style={{ 
                                        background: `${expandRight ? 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)' : 'conic-gradient(from 91deg at 50.23% 49.23%, #B60E0E 37.51646250486374deg, #E30909 135.70844650268555deg, #B60E0E 222.439284324646deg, #E30909 320.4205298423767deg)'}`,
                                        boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                                    }}
                                    onClick={handleRightCardClick}
                                >
                                    <span>Projects</span>
                                    {expandRight ? <FaArrowRight /> : <MdOutlineClose className="text-xl" /> }
                                </button>
                            </motion.div>

                            <motion.div 
                                initial={{ rotate: '7deg', opacity: 0 }}
                                animate={rightBox2Control}
                                className="absolute top-0 left-0 z-10 flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center w-[130px] xxs:w-[150px] xs:w-[180px] sm:w-[218px] rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform rotate-[7deg]"
                                style={{ 
                                    boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                                    width: `${(containerWidth / 3) - 6}px`,
                                }}
                            >
                                <div 
                                    className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                                    style={{
                                        boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                                    }}
                                >
                                    <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1753563404/6901011bb2147330146c0cbac33af1f211fef8a8_hmllcr.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                                </div>
                                <button 
                                    className="flex justify-between items-center py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                                    style={{ 
                                        background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                                        boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                                    }}
                                    onClick={() => navigateTo('/mobile-app-projects')}
                                >
                                    <span>Mobile App</span>
                                    <FaArrowRight />
                                </button>
                            </motion.div>

                            <motion.div 
                                initial={{ rotate: '7deg', opacity: 0 }}
                                animate={rightBox3Control}
                                className="flex flex-col gap-6 xxs:gap-8 xs:gap-10 justify-center items-center w-[130px] xxs:w-[150px] xs:w-[180px] sm:w-[218px] rounded-2xl xs:rounded-3xl p-3 xxs:p-4 xs:p-6 bg-white dark:bg-[#302F2F] transform rotate-[7deg]"
                                style={{ 
                                    boxShadow: `${darkMode ? '2px 3px 2px 2px rgba(255, 255, 255, 0.10)': '2px 2px 2px 2px rgba(0, 0, 0, 0.30)'}`,
                                    width: `${(containerWidth / 3) - 6}px`,
                                }}
                            >
                                <div 
                                    className="h-[72px] xxs:h-[76px] xs:h-[90px] sm:h-[115px] w-[72px] xxs:w-[76px] xs:w-[90px] sm:w-[115px] border-[6px] border-[#D9D7D7] dark:border-[#302F2F] rounded-full overflow-hidden"
                                    style={{
                                        boxShadow: `${darkMode ? '-1px -1px 2px 0 rgba(255, 255, 255, 0.25), 1px 1px 2px 0px rgba(255, 255, 255, 0.25)' : '-1px -1px 2px 0 rgba(0, 0, 0, 0.50), 1px 1px 2px 0 rgba(0, 0, 0, 0.50)'}`
                                    }}
                                >
                                    <img src="https://res.cloudinary.com/dto6lwmss/image/upload/v1768085040/6ddd586032538bcb458a4eab4891ac3a37f65299_vrznz7.jpg" alt="" loading="lazy" className="object-cover h-full w-full" />
                                </div>
                                <button 
                                    className="flex justify-between items-center py-[10px] px-4 w-full rounded-full text-[10px] xxs:text-sm sm:text-base text-nowrap font-semibold text-white"
                                    style={{ 
                                        background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                                        boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                                    }}
                                    onClick={() => navigateTo('/web-projects')}
                                >
                                    <span>Web</span>
                                    <FaArrowRight />
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
 
export default DesktopHomeCard;
