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
        name: 'Twist',
        date: '2025-08-12',
        link: 'https://twist-beige.vercel.app/',
        tags: ['HTML', 'CSS', 'Javascript', 'GitHub'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfnfbfnfbnbfnbfnfbbnfbnbfnbfnbfnbfnbfnbfnbfnfbnbfnbfnbfnbfnbfnbfnbfnbfnbfnfbnfbnfbnfbnfbnfbfnbnfbnfbnfbnfbfbfnbf',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1756564996/3f8f3811bef793146ffa534969fb6c7f656cd41b_hzrwbx.jpg',
        stack: 'Front-End',
        category: 'mobile'
    },
    {
        id: 2,
        name: 'Twist',
        date: '2025-08-12',
        link: '',
        tags: ['HTML', 'CSS', 'Javascript', 'GitHub'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1756564996/3f8f3811bef793146ffa534969fb6c7f656cd41b_hzrwbx.jpg',
        stack: 'Back-End',
        category: 'web'
    },
    {
        id: 3,
        name: 'Twist',
        date: '2025-08-12',
        link: '',
        tags: ['HTML', 'CSS', 'Javascript', 'GitHub'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1756564996/3f8f3811bef793146ffa534969fb6c7f656cd41b_hzrwbx.jpg',
        stack: 'Back-End',
        category: 'web'
    },
    {
        id: 4,
        name: 'Twist',
        date: '2025-08-12',
        link: '',
        tags: ['HTML', 'CSS', 'Javascript', 'GitHub'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1756564996/3f8f3811bef793146ffa534969fb6c7f656cd41b_hzrwbx.jpg',
        stack: 'Back-End',
        category: 'web'
    },
    {
        id: 5,
        name: 'Twist',
        date: '2025-08-12',
        link: '',
        tags: ['HTML', 'CSS', 'Javascript', 'GitHub'],
        desc: 'loremfnmfnmfnmfnfmnfnfmnmfnmfmfnfmnfmnfmnfnmfnmfnfmnmfnmfnmfnmfnmfn',
        image: 'https://res.cloudinary.com/dto6lwmss/image/upload/v1756564996/3f8f3811bef793146ffa534969fb6c7f656cd41b_hzrwbx.jpg',
        stack: 'Design',
        category: 'web'
    },
]
