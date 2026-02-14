// This is a safety shim. In the real Trickle environment, invokeAIAgent is global.
// If it's undefined, we define a mock version to prevent crashes during preview if API is missing.

if (typeof window.invokeAIAgent === 'undefined') {
    window.invokeAIAgent = async (system, user) => {
        console.log("[MockAI] System:", system);
        console.log("[MockAI] User:", user);
        
        // Return structured data based on prompts for testing
        // This is just to ensure the UI doesn't hang if the real AI isn't hooked up
        if (system.includes("extract structured skill data")) {
             return JSON.stringify({
                technical_skills: ["JavaScript", "HTML", "CSS", "React"],
                frameworks: ["React", "Tailwind"],
                tools: ["Git"],
                soft_skills: ["Communication", "Problem Solving"],
                skill_proficiency: {
                    "JavaScript": "Intermediate",
                    "React": "Beginner"
                },
                soft_skill_proficiency: {
                    "Communication": "Strong"
                },
                projects: []
             });
        }
        
        if (system.includes("competency model")) {
            return JSON.stringify({
                core_skills: [{ skill: "React", weight: 9 }, { skill: "CSS", weight: 7 }],
                supporting_skills: [{ skill: "Git", weight: 5 }],
                nice_to_have: [],
                soft_skills: [{ skill: "Communication", weight: 8 }]
            });
        }

        if (system.includes("learning roadmap")) {
            return JSON.stringify({
                week1: { focus_skills: ["React"], tasks: [{ id: 1, name: "Learn React", xp: 100 }] }
            });
        }

        return "{}";
    };
}