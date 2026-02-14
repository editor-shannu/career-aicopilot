/**
 * Career Co-Pilot Agent Logic
 * Simulates a multi-step agentic workflow:
 * 1. Profile Extraction (NLP)
 * 2. Role Modeling (Market Data)
 * 3. Gap Analysis (Math Engine)
 * 4. Roadmap Generation (Planner)
 * 5. Adaptive Recalibration (State Machine)
 */

// Helper to simulate API delays if needed
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Helper: Timeout Wrapper
const withTimeout = (promise, ms) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI Agent Timeout")), ms))
    ]);
};

// Helper: Clean JSON from AI
const parseAIResponse = (text) => {
    if (!text) throw new Error("Empty response");
    // Remove markdown code blocks
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Extract JSON object if there's extra text
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace >= 0) {
        clean = clean.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(clean);
};

// Mock Data Generators (Fallbacks)
const getMockProfile = () => ({
    technical_skills: ["JavaScript", "HTML", "CSS"],
    frameworks: ["React"],
    tools: ["Git"],
    soft_skills: ["Teamwork", "Communication"],
    skill_proficiency: { "JavaScript": "Intermediate", "React": "Beginner", "HTML": "Advanced", "CSS": "Intermediate" },
    soft_skill_proficiency: { "Teamwork": "Strong", "Communication": "Strong" },
    projects: [{ project_name: "Portfolio", skills_used: ["HTML", "CSS"] }]
});

const getMockRoleModel = (role) => ({
    core_skills: [{ skill: "React", weight: 9 }, { skill: "JavaScript", weight: 8 }, { skill: "CSS", weight: 7 }],
    supporting_skills: [{ skill: "Git", weight: 5 }, { skill: "Figma", weight: 4 }],
    nice_to_have: [{ skill: "TypeScript", weight: 3 }],
    soft_skills: [{ skill: "Communication", weight: 9 }, { skill: "Problem Solving", weight: 8 }]
});

const getMockRoadmap = (missingSkills) => {
    const skills = missingSkills.length > 0 ? missingSkills : ["Advanced React", "System Design"];
    return {
        week1: {
            focus_skills: [skills[0]],
            tasks: [
                { id: 101, name: `Master ${skills[0]} Basics`, xp: 100, resource: "https://devdocs.io", completed: false },
                { id: 102, name: "Hands-on Practice", xp: 50, resource: "https://codepen.io", completed: false },
                { id: 103, name: "Read Official Docs", xp: 50, resource: "https://developer.mozilla.org", completed: false }
            ]
        },
        week2: {
            focus_skills: [skills[1] || "Optimization"],
            tasks: [
                { id: 201, name: "Build a Mini Feature", xp: 200, resource: "https://github.com", completed: false },
                { id: 202, name: "Code Review a Peer", xp: 100, resource: "https://github.com/explore", completed: false }
            ]
        },
        week3: {
            focus_skills: ["Integration", "Testing"],
            tasks: [
                { id: 301, name: "Write Unit Tests", xp: 200, resource: "https://jestjs.io", completed: false },
                { id: 302, name: "Refactor Legacy Code", xp: 150, resource: "#", completed: false }
            ]
        },
        week4: {
            focus_skills: ["Deployment"],
            tasks: [
                { id: 401, name: "Deploy to Production", xp: 300, resource: "https://vercel.com", completed: false },
                { id: 402, name: "Document Your Journey", xp: 200, resource: "https://medium.com", completed: false }
            ]
        },
        capstone: {
            title: "Career Accelerator Project",
            description: "A final project integrating all your new skills.",
            skills: skills
        }
    };
};

/**
 * STEP 1: PROFILE STRUCTURING
 */
window.analyzeProfileAgent = async function(resumeText, githubUrl, linkedinSummary) {
    const systemPrompt = `You are an expert Technical Recruiter. Extract structured skill data from the inputs.
    Output JSON only:
    {
        "technical_skills": ["skill1"],
        "frameworks": ["react"],
        "tools": ["git"],
        "soft_skills": ["communication"],
        "skill_proficiency": { "skill_name": "Beginner"|"Intermediate"|"Advanced" },
        "soft_skill_proficiency": { "skill_name": "Basic"|"Strong" },
        "projects": [ { "project_name": "...", "skills_used": ["..."] } ]
    }`;

    const userPrompt = `Resume: ${resumeText.substring(0, 2000)}\nGitHub: ${githubUrl}\nLinkedIn: ${linkedinSummary}`;

    try {
        if (typeof window.invokeAIAgent !== 'undefined') {
             const raw = await withTimeout(window.invokeAIAgent(systemPrompt, userPrompt), 20000); // 20s timeout
             return parseAIResponse(raw);
        } else {
            console.warn("invokeAIAgent missing, using mock.");
            await sleep(1500);
            return getMockProfile();
        }
    } catch (error) {
        console.warn("Agent Profile Analysis Failed/Timed out, using fallback.", error);
        return getMockProfile();
    }
};

/**
 * STEP 2: ROLE MODELING
 */
window.modelDreamRoleAgent = async function(role, companyType) {
    const systemPrompt = `Define competency model for '${role}' at '${companyType}'.
    Output JSON only:
    {
        "core_skills": [ {"skill": "name", "weight": 1-10} ],
        "supporting_skills": [ {"skill": "name", "weight": 1-7} ],
        "nice_to_have": [ {"skill": "name", "weight": 1-5} ],
        "soft_skills": [ {"skill": "name", "weight": 1-10} ]
    }`;

    const userPrompt = `Role: ${role}, Company: ${companyType}`;

    try {
        if (typeof window.invokeAIAgent !== 'undefined') {
             const raw = await withTimeout(window.invokeAIAgent(systemPrompt, userPrompt), 20000);
             return parseAIResponse(raw);
        } else {
            await sleep(1500);
            return getMockRoleModel(role);
        }
    } catch (error) {
        console.warn("Agent Role Modeling Failed/Timed out, using fallback.", error);
        return getMockRoleModel(role);
    }
};

/**
 * STEP 3: GAP INTELLIGENCE ENGINE (Math - No AI)
 */
window.calculateGapsEngine = function(profile, roleModel) {
    // Safe guard inputs
    if (!profile) profile = getMockProfile();
    if (!roleModel) roleModel = getMockRoleModel("Generic Role");

    let techScoreTotal = 0;
    let techMaxScore = 0;
    
    const missingCore = [];
    const underdeveloped = [];
    const strong = [];

    // --- Technical Core Skill Scoring ---
    (roleModel.core_skills || []).forEach(req => {
        const p = profile.skill_proficiency || {};
        const userLevel = p[req.skill] || p[req.skill.toLowerCase()] || "Missing";
        
        let score = 0;
        if (userLevel === "Advanced") score = 1.0;
        else if (userLevel === "Intermediate") score = 0.7;
        else if (userLevel === "Beginner") score = 0.4;
        
        techScoreTotal += (req.weight * score);
        techMaxScore += req.weight;

        if (score === 0) missingCore.push(req.skill);
        else if (score < 0.7) underdeveloped.push(req.skill);
        else strong.push(req.skill);
    });

    // --- Supporting Skill Scoring ---
    (roleModel.supporting_skills || []).forEach(req => {
        const p = profile.skill_proficiency || {};
        const userLevel = p[req.skill] || p[req.skill.toLowerCase()] || "Missing";
        
        let score = 0;
        if (userLevel === "Advanced") score = 1.0;
        else if (userLevel === "Intermediate") score = 0.75;
        else if (userLevel === "Beginner") score = 0.5;
        
        techScoreTotal += (req.weight * score);
        techMaxScore += req.weight;
        
        if (score > 0 && score < 0.75) underdeveloped.push(req.skill);
        if (score >= 0.75) strong.push(req.skill);
    });

    const technicalScore = techMaxScore > 0 ? Math.round((techScoreTotal / techMaxScore) * 100) : 50;

    // --- Soft Skill Scoring ---
    let softTotal = 0;
    let softMax = 0;
    const missingSoft = [];

    (roleModel.soft_skills || []).forEach(req => {
        const p = profile.soft_skill_proficiency || {};
        const userLevel = p[req.skill] || p[req.skill.toLowerCase()] || "Missing";
        
        let score = 0;
        if (userLevel === "Strong") score = 1.0;
        else if (userLevel === "Basic") score = 0.5;
        
        softTotal += (req.weight * score);
        softMax += req.weight;

        if (score === 0) missingSoft.push(req.skill);
    });

    const softSkillScore = softMax > 0 ? Math.round((softTotal / softMax) * 100) : 50;

    // --- Overall Readiness ---
    const overallReadiness = Math.round((technicalScore * 0.75) + (softSkillScore * 0.25));

    // --- Success Prob ---
    let successProb = overallReadiness;
    if (missingCore.length > 2) successProb -= 15;
    successProb = Math.max(10, Math.min(98, successProb));

    // Career Level
    let careerLevel = "Explorer";
    if (overallReadiness > 90) careerLevel = "Interview-Ready";
    else if (overallReadiness > 75) careerLevel = "Job-Ready";
    else if (overallReadiness > 50) careerLevel = "Practitioner";
    else if (overallReadiness > 25) careerLevel = "Builder";

    return {
        technical_score: technicalScore,
        soft_skill_score: softSkillScore,
        overall_readiness_score: overallReadiness,
        career_level: careerLevel,
        xp_points: Math.floor(overallReadiness * 12.5),
        application_success_probability: successProb,
        missing_core_skills: missingCore,
        missing_soft_skills: missingSoft,
        underdeveloped_skills: underdeveloped,
        strong_skills: strong,
        explanation_summary: `You have strong foundations in ${strong.slice(0,3).join(", ") || "core areas"}. To reach ${careerLevel} level, focus on ${missingCore.slice(0,3).join(", ") || "technical depth"}.`
    };
};

/**
 * STEP 4: ROADMAP GENERATION
 */
window.generateRoadmapAgent = async function(gaps, hoursPerDay, currentLevel) {
    const missingSkills = [...(gaps.missing_core_skills || []), ...(gaps.underdeveloped_skills || [])].slice(0, 5); 
    
    const systemPrompt = `Create a 30-day learning roadmap.
    Inputs: Missing: ${missingSkills.join(", ")}, Hours: ${hoursPerDay}, Level: ${currentLevel}
    Output JSON only:
    {
        "week1": { "focus_skills": [], "tasks": [ { "id": 101, "name": "...", "xp": 50, "resource": "...", "deliverable": "..." } ] },
        "week2": { ... }, "week3": { ... }, "week4": { ... },
        "capstone": { "title": "...", "description": "...", "skills": [] }
    }`;

    const userPrompt = "Generate plan.";

    try {
        if (typeof window.invokeAIAgent !== 'undefined') {
             const raw = await withTimeout(window.invokeAIAgent(systemPrompt, userPrompt), 25000); // 25s timeout
             return parseAIResponse(raw);
        } else {
            await sleep(1500);
            return getMockRoadmap(missingSkills);
        }
    } catch (error) {
        console.warn("Agent Roadmap Generation Failed/Timed out, using fallback.", error);
        return getMockRoadmap(missingSkills);
    }
};

/**
 * STEP 5: RECALIBRATION
 */
window.recalibrateAgent = function(currentStats, completedTasksXp) {
    const xpGain = completedTasksXp;
    const readinessGain = Math.floor(xpGain / 500);
    const newReadiness = Math.min(100, currentStats.overall_readiness_score + readinessGain);
    const newXp = currentStats.xp_points + xpGain;
    const probGain = Math.floor(xpGain / 1000);
    const newProb = Math.min(100, currentStats.application_success_probability + probGain);

    return {
        ...currentStats,
        overall_readiness_score: newReadiness,
        xp_points: newXp,
        application_success_probability: newProb,
        score_difference: readinessGain
    };
};