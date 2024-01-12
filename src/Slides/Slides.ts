export type QuickStartItem = {
    id: number;
    title: string;
    description: string;
    image: string;
};

const quickStartData: QuickStartItem[] = [
    {
        id: 1,
        title: 'Quick Start 1',
        description: 'Quick Start description',
        image: require('../../assets/images/artist-1.jpg')
    },
    {
        id: 2,
        title: 'Quick Start 2',
        description: 'Quick Start description 2',
        image: require('../../assets/images/artist-2.jpg')
    },
    {
        id: 3,
        title: 'Quick Start 3',
        description: 'Quick Start description 3',
        image: require('../../assets/images/artist-1.jpg')
    },
    {
        id: 4,
        title: 'Quick Start 4',
        description: 'Quick Start description 4',
        image: require('../../assets/images/artist-2.jpg')
    }
];

export default quickStartData;