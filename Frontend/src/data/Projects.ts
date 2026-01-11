export interface IProjects {
    id: number,
    name: string,
    date: string,
    link: string,
    tags: string[],
    desc: string,
    image: string,
    stack?: string,
    category: string
} 

export const projects: IProjects[] = [
    {
        id: 1,
        name: 'Luminous Digital Vision',
        date: '2025-08-12',
        link: 'https://luminousdigitalvisions.com/',
        tags: ['React', 'Typescript', 'Tailwind'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfnfbfnfbnbfnbfnfbbnfbnbfnbfnbfnbfnbfnbfnbfnfbnbfnbfnbfnbfnbfnbfnbfnbfnbfnfbnfbnfbnfbnfbnfbfnbnfbnfbnfbnfbfbfnbf',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768140656/Screenshot_2026-01-11_at_14.47.55_11zon_be15qv.jpg',
        category: 'demo'
    },
    {
        id: 2,
        name: 'Scarsdale Solicitors',
        date: '2025-08-12',
        link: 'https://scarsdalesolicitors.com/',
        tags: ['HTML', 'CSS', 'Javascript', 'Wordpress'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768140655/Screenshot_2026-01-11_at_14.45.54_11zon_tumwew.jpg',
        category: 'demo'
    },
    {
        id: 3,
        name: 'ProPulse',
        date: '2025-08-12',
        link: 'https://pro-pulse-tawny.vercel.app/',
        tags: ['React', 'Javascript', 'CSS'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141953/Screenshot_2026-01-11_at_15.30.08_11zon_pzmdmm.jpg',
        category: 'demo'
    },
    {
        id: 4,
        name: 'Twist',
        date: '2025-08-12',
        link: 'https://twist-beige.vercel.app/',
        tags: ['HTML', 'CSS', 'Javascript'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141954/Screenshot_2026-01-11_at_15.31.16_11zon_d9lpyo.jpg',
        category: 'demo'
    },
    {
        id: 5,
        name: 'Vista',
        date: '2025-08-12',
        link: 'https://vista-drab.vercel.app/',
        tags: ['React', 'Javascript', 'Tailwind'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1768141954/Screenshot_2026-01-11_at_15.30.44_11zon_ejc32z.jpg',
        category: 'demo'
    },
]
