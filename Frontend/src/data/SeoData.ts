import type { SEODataMap } from '../types/seo.types';

const baseUrl = 'https://edwin-promise.vercel.app';

export const seoData: SEODataMap = {

    // ========================================
    // HOME PAGE
    // ========================================

    home: {
        title: 'Edwin Promise - Full-Stack Web Developer',
        description: 'Full-Stack Web Developer specializing in React, TypeScript, Laravel, and Go. Building modern, scalable web and mobile applications in Nigeria.',
        keywords: [
            'Edwin Promise',
            'Web Developer',
            'Full-Stack Developer',
            'React Developer',
            'TypeScript Developer',
            'Laravel Developer',
            'Web Developer Nigeria',
            'Software Engineer',
            'Portfolio'
        ],
        path: '/',
        image: `${baseUrl}/images/home-preview.jpg`, // Create this image
        schema: {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Edwin Promise",
            "url": baseUrl,
            "image": `${baseUrl}/images/edwin-promise.jpg`,
            "jobTitle": "Full-Stack Web Developer",
            "description": "Full-Stack Web Developer specializing in React, TypeScript, Laravel, and Go",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lagos",
                "addressCountry": "Nigeria"
            },
            "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
            },
            "sameAs": [
                "https://github.com/Promzy004",
                "https://www.linkedin.com/in/edwin-promise-a73b822b6/",
                "https://x.com/promzy_004",
                "https://instagram.com/promzy_004"
            ],
            "knowsAbout": [
                "React",
                "TypeScript",
                "Laravel",
                "Go",
                "Python",
                "JavaScript",
                "TailwindCSS",
                "PHP",
                "Mobile Development"
            ],
        }
    },


    // ========================================
    // ABOUT PAGE
    // ========================================

    about: {
        title: 'About',
        description: 'Learn more about Edwin Promise, a passionate Full-Stack Developer with expertise in building modern web and mobile applications using React, TypeScript, and Laravel.',
        keywords: [
            'About Edwin Promise',
            'Full-Stack Developer Bio',
            'Web Developer Nigeria',
            'React Developer',
            'Software Engineer Background'
        ],
        path: '/about',
        image: `${baseUrl}/images/about-preview.jpg`,
        schema: {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Edwin Promise",
            "url": `${baseUrl}/about`,
            "jobTitle": "Full-Stack Web Developer",
            "description": "Passionate developer with expertise in building modern web and mobile applications",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lagos",
                "addressCountry": "Nigeria"
            },
            "sameAs": [
                "https://github.com/Promzy004",
                "https://www.linkedin.com/in/edwin-promise-a73b822b6/"
            ],
            "knowsAbout": [
                "React",
                "TypeScript",
                "Laravel",
                "Go",
                "Mobile Development",
                "Full-Stack Development"
            ]
        }
    },

    // ========================================
    // WEB PROJECTS PAGE
    // ========================================
    webProjects: {
        title: 'Web Projects',
        description: 'Explore a portfolio of web applications built by Edwin Promise using React, TypeScript, Laravel, and modern web technologies. Full-stack projects demonstrating scalable architecture and best practices.',
        keywords: [
            'Web Development Projects',
            'React Projects',
            'Laravel Projects',
            'Full-Stack Portfolio',
            'TypeScript Applications',
            'Web Apps'
        ],
        path: '/web-projects',
        image: `${baseUrl}/images/web-projects-preview.jpg`,
        schema: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Web Development Projects",
            "description": "Portfolio of web applications built with React, TypeScript, and Laravel",
            "url": `${baseUrl}/web-projects`,
            "author": {
                "@type": "Person",
                "name": "Edwin Promise",
                "url": baseUrl
            },
            "creator": {
                "@type": "Person",
                "name": "Edwin Promise"
            },
            "mainEntity": {
                "@type": "ItemList",
                "name": "Web Projects Portfolio",
                "description": "Collection of full-stack web applications",
                "numberOfItems": 5, // Update this with your actual count
                "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                    "@type": "SoftwareApplication",
                    "name": "Project 1 Name", // Update with real project
                    "description": "Project 1 description",
                    "url": "https://project1-url.com",
                    "applicationCategory": "WebApplication",
                    "author": {
                        "@type": "Person",
                        "name": "Edwin Promise"
                    },
                    "programmingLanguage": ["React", "TypeScript", "TailwindCSS"]
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                    "@type": "SoftwareApplication",
                    "name": "Project 2 Name",
                    "description": "Project 2 description",
                    "url": "https://project2-url.com",
                    "applicationCategory": "WebApplication",
                    "author": {
                        "@type": "Person",
                        "name": "Edwin Promise"
                    },
                    "programmingLanguage": ["React", "Laravel", "MySQL"]
                    }
                }
                // Add more projects here
                ]
            }
        }
    },



    // ========================================
    // MOBILE PROJECTS PAGE
    // ========================================

    mobileProjects: {
        title: 'Mobile App Projects',
        description: 'Discover mobile applications for iOS and Android built by Edwin Promise. Native and cross-platform apps showcasing modern mobile development practices.',
        keywords: [
            'Mobile App Development',
            'React Native Projects',
            'iOS Apps',
            'Android Apps',
            'Mobile Portfolio',
            'Cross-Platform Apps'
        ],
        path: '/mobile-app-projects',
        image: `${baseUrl}/images/mobile-projects-preview.jpg`,
        schema: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Mobile App Development Projects",
            "description": "Portfolio of mobile applications for iOS and Android",
            "url": `${baseUrl}/mobile-app-projects`,
            "author": {
                "@type": "Person",
                "name": "Edwin Promise",
                "url": baseUrl
            },
            "mainEntity": {
                "@type": "ItemList",
                "name": "Mobile Apps Portfolio",
                "description": "Collection of mobile applications",
                "numberOfItems": 3, // Update this
                "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                    "@type": "MobileApplication",
                    "name": "Mobile App 1 Name", // Update with real app
                    "description": "Mobile app 1 description",
                    "url": "https://app1-url.com",
                    "applicationCategory": "Productivity",
                    "operatingSystem": "Android, iOS",
                    "author": {
                        "@type": "Person",
                        "name": "Edwin Promise"
                    }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                    "@type": "MobileApplication",
                    "name": "Mobile App 2 Name",
                    "description": "Mobile app 2 description",
                    "url": "https://app2-url.com",
                    "applicationCategory": "Entertainment",
                    "operatingSystem": "Android, iOS",
                    "author": {
                        "@type": "Person",
                        "name": "Edwin Promise"
                    }
                    }
                }
                // Add more apps here
                ]
            }
        }
    },
};