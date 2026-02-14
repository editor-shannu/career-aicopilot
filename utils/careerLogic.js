// Mock logic for career analysis and gamification

window.LEVELS = [
    { name: "Explorer", min: 0, max: 25, color: "text-slate-500", bg: "bg-slate-100" },
    { name: "Builder", min: 26, max: 50, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Practitioner", min: 51, max: 75, color: "text-indigo-500", bg: "bg-indigo-100" },
    { name: "Job-Ready", min: 76, max: 90, color: "text-purple-500", bg: "bg-purple-100" },
    { name: "Interview-Ready", min: 91, max: 100, color: "text-emerald-500", bg: "bg-emerald-100" }
];

window.getLevelInfo = (score) => {
    return window.LEVELS.find(l => score >= l.min && score <= l.max) || window.LEVELS[0];
};

window.calculateInitialStats = (formData) => {
    // Simulate complex calculation based on inputs
    const baseScore = Math.floor(Math.random() * 20) + 40; // Random start 40-60
    
    return {
        readiness: baseScore,
        technical: Math.floor(baseScore * 0.9),
        softSkills: Math.floor(baseScore * 1.1 > 100 ? 100 : baseScore * 1.1),
        successProb: Math.floor(baseScore * 0.7),
        xp: 1250,
        nextLevelXp: 2500,
        level: window.getLevelInfo(baseScore).name
    };
};

window.initialSkillTree = {
    role: "Frontend Developer",
    core: [
        { name: "React / Modern JS", status: "strong" },
        { name: "CSS Architecture", status: "underdeveloped" },
        { name: "State Management", status: "missing" },
        { name: "TypeScript", status: "missing" }
    ],
    soft: [
        { name: "Communication", status: "strong" },
        { name: "Problem Solving", status: "strong" },
        { name: "Mentorship", status: "underdeveloped" }
    ]
};

window.initialChallenges = [
    {
        id: 1,
        title: "Foundation Challenge",
        tasks: [
            { id: 101, name: "Optimize LinkedIn Headline", xp: 50, resource: "https://example.com", completed: false },
            { id: 102, name: "Push 1 Code Commit", xp: 100, resource: "#", completed: false },
            { id: 103, name: "Analyze 3 Job Descriptions", xp: 75, resource: "#", completed: false }
        ]
    },
    {
        id: 2,
        title: "Skill Builder Project",
        tasks: [
            { id: 201, name: "Build a To-Do App", xp: 200, resource: "#", completed: false },
            { id: 202, name: "Implement Dark Mode", xp: 150, resource: "#", completed: false }
        ]
    },
    {
        id: 3,
        title: "Advanced Integration",
        tasks: [
            { id: 301, name: "Connect to an API", xp: 250, resource: "#", completed: false },
            { id: 302, name: "Add Unit Tests", xp: 200, resource: "#", completed: false }
        ]
    },
    {
        id: 4,
        title: "Capstone Boss Challenge",
        tasks: [
            { id: 401, name: "Deploy to Vercel/Netlify", xp: 500, resource: "#", completed: false },
            { id: 402, name: "Write Case Study", xp: 300, resource: "#", completed: false }
        ]
    }
];