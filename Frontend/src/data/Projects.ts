export interface IProjects {
    id: number,
    name: string,
    date: string,
    link: string,
    tags: string[],
    desc?: string,
    image: string,
    stack?: string,
    category: string
} 

export const projects: IProjects[] = [
    // {
    //     id: 1,
    //     name: 'Luminous Digital Vision',
    //     date: '2025-08-12',
    //     link: 'https://luminousdigitalvisions.com/',
    //     tags: ['React', 'Typescript', 'Tailwind'],
    //     desc: 'Corporate website for digital agency built with modern React, TypeScript, and TailwindCSS stack. Features responsive design, smooth animations, and optimized performance. Showcases company services, portfolio, and team information with professional UI/UX design.',
    //     image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768140656/Screenshot_2026-01-11_at_14.47.55_11zon_be15qv.jpg',
    //     category: 'web'
    // },
    // {
    //     id: 2,
    //     name: 'Scarsdale Solicitors - Law Firm Website',
    //     date: '2025-08-12',
    //     link: 'https://scarsdalesolicitors.com/',
    //     tags: ['HTML', 'CSS', 'Javascript', 'Wordpress'],
    //     desc: 'Professional law firm website developed collaboratively as part of a development team. Built using WordPress with custom HTML, CSS, and JavaScript to create a user-friendly interface for legal services. Features practice area showcases, attorney profiles, and contact forms for client inquiries.',
    //     image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768140655/Screenshot_2026-01-11_at_14.45.54_11zon_tumwew.jpg',
    //     category: 'web'
    // },
    {
        id: 3,
        name: 'ProPulse E-Commerce Platform',
        date: '2024-10-07',
        link: 'https://pro-pulse-tawny.vercel.app/',
        tags: ['React', 'Javascript', 'CSS'],
        // desc: 'Full-featured e-commerce web application built with React and Context API. Implements shopping cart functionality, product catalog, and responsive design for seamless online shopping experience. Demonstrates modern frontend development practices with JavaScript and CSS.',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141953/Screenshot_2026-01-11_at_15.30.08_11zon_pzmdmm.jpg',
        category: 'web'
    },
    {
        id: 4,
        name: 'Twist',
        date: '2025-02-10',
        link: 'https://twist-beige.vercel.app/',
        tags: ['HTML', 'CSS', 'Javascript'],
        // desc: 'Pixel-perfect website clone completed within a 3-day deadline as part of internship technical assessment. Built with vanilla HTML, CSS, and JavaScript, demonstrating ability to replicate complex designs and meet tight project timelines. Showcases strong frontend fundamentals and attention to detail.',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141954/Screenshot_2026-01-11_at_15.31.16_11zon_d9lpyo.jpg',
        category: 'web'
    },
    {
        id: 5,
        name: 'Vista',
        date: '2025-02-29',
        link: 'https://vista-drab.vercel.app/',
        tags: ['React', 'Javascript', 'Tailwind'],
        // desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141954/Screenshot_2026-01-11_at_15.30.44_11zon_ejc32z.jpg',
        category: 'web'
    },
    {
        id: 6,
        name: 'Real Estate Management Platform',
        date: '2025-06-16',
        link: 'https://github.com/Promzy004/PrimeDwell',
        tags: ["Laravel", "React", "MySQL", "TailwindCSS"],
        // desc: 'Full-stack real estate application featuring property listings, search functionality, and user management. Built with Laravel backend and React frontend, demonstrating complete CRUD operations, database design with MySQL, and RESTful API implementation. Includes property filtering, image galleries, and responsive design.',
        image: '',
        category: 'web'
    },
    {
        id: 7,
        name: 'Todo App - Go & React Full-Stack',
        date: '2025-08-12',
        link: 'https://github.com/Promzy004/fullstack-todo-app',
        tags: ["Go (Golang)", "React", "MySQL", "TailwindCSS"],
        // desc: 'Full-stack task management application built with Go (Golang) backend and React frontend. Developed as part of Go learning initiative, featuring RESTful API, MySQL database, Zustand state management, and TailwindCSS styling. Demonstrates proficiency in modern backend development with Go and frontend integration.',
        image: '',
        category: 'web'
    },
]
