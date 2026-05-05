interface IProject {
    id: string;
    name: string;
    description: string;
    lastModified: string;
    fileCount: number;
}

interface IRecentFile {
    id: string;
    name: string;
    type: 'document' | 'diagram';
    project: string;
    lastModified: string;
    modifiedBy: string;
    avatar: string;
    color: string;
}

interface IRecentChange {
    id: string;
    fileName: string;
    project: string;
    change: string;
    time: string;
    author: string;
    avatar: string;
    color: string;
}

export type {IProject, IRecentFile, IRecentChange}

const projects: IProject[] = [
    {
        id: '1',
        name: 'Product Design System',
        description: 'Architecture diagrams and documentation',
        lastModified: '2 hours ago',
        fileCount: 24,
    },
    {
        id: '2',
        name: 'Mobile App Workflows',
        description: 'BPMN diagrams for user flows',
        lastModified: '5 hours ago',
        fileCount: 18,
    },
    {
        id: '3',
        name: 'API Documentation',
        description: 'REST API specs and diagrams',
        lastModified: '1 day ago',
        fileCount: 31,
    },
];

const recentFiles: IRecentFile[] = [
    {
        id: '1',
        name: 'C4 Context Diagram',
        type: 'diagram',
        project: 'Product Design System',
        lastModified: '2 min ago',
        modifiedBy: 'Alice Chen',
        avatar: 'AC',
        color: 'bg-blue-500',
    },
    {
        id: '2',
        name: 'System Overview.md',
        type: 'document',
        project: 'Product Design System',
        lastModified: '15 min ago',
        modifiedBy: 'Bob Smith',
        avatar: 'BS',
        color: 'bg-purple-500',
    },
    {
        id: '3',
        name: 'User Onboarding.bpmn',
        type: 'diagram',
        project: 'Mobile App Workflows',
        lastModified: '1 hour ago',
        modifiedBy: 'Carol Davis',
        avatar: 'CD',
        color: 'bg-green-500',
    },
    {
        id: '4',
        name: 'API Reference.md',
        type: 'document',
        project: 'API Documentation',
        lastModified: '3 hours ago',
        modifiedBy: 'Alice Chen',
        avatar: 'AC',
        color: 'bg-blue-500',
    },
];

const recentChanges: IRecentChange[] = [
    {
        id: '1',
        fileName: 'C4 Context Diagram',
        project: 'Product Design System',
        change: 'Added Database component',
        time: '5 min ago',
        author: 'Alice Chen',
        avatar: 'AC',
        color: 'bg-blue-500',
    },
    {
        id: '2',
        fileName: 'System Overview.md',
        project: 'Product Design System',
        change: 'Updated security section',
        time: '20 min ago',
        author: 'Bob Smith',
        avatar: 'BS',
        color: 'bg-purple-500',
    },
    {
        id: '3',
        fileName: 'Payment Flow',
        project: 'Mobile App Workflows',
        change: 'Added error handling branch',
        time: '1 hour ago',
        author: 'Carol Davis',
        avatar: 'CD',
        color: 'bg-green-500',
    },
    {
        id: '4',
        fileName: 'Entity Relationship',
        project: 'Product Design System',
        change: 'Connected User to Orders table',
        time: '2 hours ago',
        author: 'Alice Chen',
        avatar: 'AC',
        color: 'bg-blue-500',
    },
];

export {projects, recentFiles, recentChanges}