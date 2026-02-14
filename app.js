// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Access global functions
const { analyzeProfileAgent, modelDreamRoleAgent, calculateGapsEngine, generateRoadmapAgent, recalibrateAgent } = window;

function App() {
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  
  const [appState, setAppState] = React.useState('onboarding'); // onboarding, analyzing_profile, modeling_role, generating_plan, dashboard
  const [loadingMsg, setLoadingMsg] = React.useState('');
  
  const [userProfile, setUserProfile] = React.useState(null);
  const [roleModel, setRoleModel] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [roadmap, setRoadmap] = React.useState(null);

  // Auth Listener
  React.useEffect(() => {
    const unsubscribe = window.onAuthStateChange(async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            try {
                // 1. Ensure User Doc Exists
                await window.ensureUserDoc(currentUser);
                
                // 2. Fetch User Data
                const data = await window.fetchUserData(currentUser.uid);
                
                if (data && data.roadmap && data.readinessScore) {
                    // Restore state from DB
                    setUserProfile(data.profileData);
                    setRoleModel(data.roleModel);
                    setRoadmap(data.roadmap);
                    
                    const lvlInfo = window.getLevelInfo(data.readinessScore);
                    
                    setStats({
                        readiness: data.readinessScore,
                        technical: data.technicalScore,
                        softSkills: data.softSkillScore,
                        successProb: data.applicationProbability,
                        xp: data.xpPoints,
                        nextLevelXp: data.xpPoints + 2500,
                        level: lvlInfo ? lvlInfo.name : 'Explorer',
                        ...data.gapAnalysis
                    });
                    
                    setAppState('dashboard');
                } else {
                    setAppState('onboarding');
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setAppState('onboarding');
            }
        } else {
            setUser(null);
            setAppState('onboarding');
        }
        setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Safe save that doesn't block UI
  const safeSaveToFirebase = async (newStats, newRoadmap, newProfile, newRoleModel) => {
      if (!user) return;
      try {
          const dataToSave = {};
          if (newStats) {
              dataToSave.readinessScore = newStats.readiness;
              dataToSave.technicalScore = newStats.technical;
              dataToSave.softSkillScore = newStats.softSkills;
              dataToSave.xpPoints = newStats.xp;
              dataToSave.applicationProbability = newStats.successProb;
              dataToSave.gapAnalysis = {
                  missing_core_skills: newStats.missing_core_skills,
                  missing_soft_skills: newStats.missing_soft_skills,
                  underdeveloped_skills: newStats.underdeveloped_skills,
                  strong_skills: newStats.strong_skills,
                  explanation_summary: newStats.explanation_summary
              };
          }
          if (newRoadmap) dataToSave.roadmap = newRoadmap;
          if (newProfile) dataToSave.profileData = newProfile;
          if (newRoleModel) dataToSave.roleModel = newRoleModel;

          await window.saveUserProgress(user.uid, dataToSave);
      } catch (err) {
          console.error("Background save failed:", err);
          // Do not interrupt user experience
      }
  };

  const handleProfileStart = async (formData) => {
    // START AGENT WORKFLOW
    try {
        setAppState('analyzing_profile');
        setLoadingMsg('Agent is extracting skills from your profile...');
        
        // Step 1: Analyze Profile
        const extractedProfile = await analyzeProfileAgent(formData.resume, formData.github, formData.linkedin);
        setUserProfile(extractedProfile);

        setAppState('modeling_role');
        setLoadingMsg(`Agent is modeling market requirements for ${formData.dreamRole}...`);
        
        // Step 2: Model Role
        const model = await modelDreamRoleAgent(formData.dreamRole, formData.companyType);
        setRoleModel(model);

        // Step 3: Gap Analysis
        setLoadingMsg('Gap Intelligence Engine is computing readiness...');
        const gapsAndStats = calculateGapsEngine(extractedProfile, model);
        
        const currentLevelName = gapsAndStats.career_level;
        
        const displayStats = {
            ...gapsAndStats,
            readiness: gapsAndStats.overall_readiness_score,
            technical: gapsAndStats.technical_score,
            softSkills: gapsAndStats.soft_skill_score,
            successProb: gapsAndStats.application_success_probability,
            xp: gapsAndStats.xp_points,
            nextLevelXp: gapsAndStats.xp_points + 2500,
            level: currentLevelName
        };
        setStats(displayStats);

        setAppState('generating_plan');
        setLoadingMsg('Agent is generating your 30-Day Vibe-Check Roadmap...');

        // Step 4: Generate Roadmap
        const plan = await generateRoadmapAgent(gapsAndStats, formData.hours, currentLevelName);
        setRoadmap(plan);
        
        // SAVE & SWITCH
        // Trigger save in background, don't await to block UI transition if it hangs
        safeSaveToFirebase(displayStats, plan, extractedProfile, model);

        setAppState('dashboard');

    } catch (error) {
        console.error("Agent Workflow Error", error);
        alert("We encountered a hiccup, but we've loaded a default path for you to explore.");
        setAppState('dashboard'); // Fallback to dashboard even on error if possible, or onboarding
    }
  };

  const handleTaskComplete = async (xpAmount, isAdding) => {
    if (!stats) return;

    const newStatsRaw = recalibrateAgent({
        overall_readiness_score: stats.readiness,
        xp_points: stats.xp,
        application_success_probability: stats.successProb
    }, isAdding ? xpAmount : -xpAmount);

    const updatedStats = {
        ...stats,
        readiness: newStatsRaw.overall_readiness_score,
        xp: newStatsRaw.xp_points,
        successProb: newStatsRaw.application_success_probability,
        lastDiff: newStatsRaw.score_difference
    };

    setStats(updatedStats);
    safeSaveToFirebase(updatedStats);
  };

  const handleRoadmapUpdate = async (updatedPlan) => {
      setRoadmap(updatedPlan);
      safeSaveToFirebase(null, updatedPlan);
  };

  const handleManualRecalibrate = async () => {
    const updatedStats = {
        ...stats,
        readiness: Math.min(100, stats.readiness + 1),
        successProb: Math.min(100, stats.successProb + 2)
    };
    setStats(updatedStats);
    safeSaveToFirebase(updatedStats);
  };
  
  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="icon-loader animate-spin text-3xl text-indigo-600"></div>
          </div>
      );
  }

  if (!user) {
      return <LoginScreen />;
  }

  // Dashboard View
  if (appState === 'dashboard' && stats) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 animate-fade-in" data-name="app" data-file="app.js">
            <Header stats={stats} user={user} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <IntelligenceCards stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <SkillTree role={userProfile?.dreamRole || "Dream Role"} /> 
                        <ChallengeRoadmap 
                            plan={roadmap} 
                            onTaskComplete={handleTaskComplete}
                            onPlanUpdate={handleRoadmapUpdate} 
                        />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                             <h3 className="font-bold text-lg mb-2">Agent Insight</h3>
                             <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                                {stats.explanation_summary || "Focus on your missing core skills to boost readiness."}
                             </p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="icon-book-open text-indigo-500"></div>
                                AI Curated Resources
                            </h3>
                            <ul className="space-y-3">
                                {stats.missing_core_skills && stats.missing_core_skills.slice(0,3).map(skill => (
                                    <li key={skill} className="flex gap-3 items-start group cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <div className="icon-search text-slate-400 group-hover:text-indigo-500"></div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600">Mastering {skill}</div>
                                            <div className="text-xs text-slate-500">Recommended for you</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Recalibration onRecalibrate={handleManualRecalibrate} />
        </div>
    );
  }

  // Onboarding View
  if (appState === 'onboarding') {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10 animate-fade-in">
            <Header stats={{ readiness: 0, xp: 0, nextLevelXp: 1000, successProb: 0 }} user={user} />
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">Let's Calibrate Your Career</h1>
                    <p className="text-slate-500">Tell us where you are, and where you want to be.</p>
                </div>
                <ProfileForm onComplete={handleProfileStart} />
            </div>
        </div>
    );
  }

  // Loading States
  return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 relative mb-6">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="icon-bot text-indigo-600 text-3xl animate-pulse"></div>
                </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{loadingMsg}</h2>
            <div className="max-w-md w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ 
                        width: appState === 'analyzing_profile' ? '30%' : 
                               appState === 'modeling_role' ? '60%' : '90%' 
                    }}
                ></div>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-mono">
                Process: {appState.replace('_', ' ').toUpperCase()}
            </div>
        </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);