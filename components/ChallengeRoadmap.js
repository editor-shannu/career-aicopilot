function ChallengeRoadmap({ plan, onTaskComplete, onPlanUpdate }) {
    const [openWeek, setOpenWeek] = React.useState('week1');
    const [localPlan, setLocalPlan] = React.useState(plan || {});

    React.useEffect(() => {
        if(plan) setLocalPlan(plan);
    }, [plan]);

    const toggleTask = (weekKey, taskId, xp) => {
        // 1. Identify the task and its new status
        const week = localPlan[weekKey];
        if (!week) return;
        
        const task = week.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = !task.completed;

        // 2. Trigger side effects
        // Update stats
        onTaskComplete(xp, newStatus);
        
        // Update plan persistence if handler exists
        const updatedLocalPlan = {
            ...localPlan,
            [weekKey]: {
                ...week,
                tasks: week.tasks.map(t => t.id === taskId ? { ...t, completed: newStatus } : t)
            }
        };
        
        if (onPlanUpdate) {
            onPlanUpdate(updatedLocalPlan);
        }

        // 3. Update local state
        setLocalPlan(updatedLocalPlan);
    };

    if (!localPlan || Object.keys(localPlan).length === 0) return null;

    // Filter out 'capstone' key to iterate weeks
    const weekKeys = Object.keys(localPlan).filter(k => k.startsWith('week'));

    return (
        <div className="card mb-8 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <div className="icon-calendar text-xl"></div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">30-Day Vibe-Check Roadmap</h3>
                    <p className="text-xs text-slate-500">AI-curated daily micro-tasks</p>
                </div>
            </div>

            <div className="space-y-4">
                {weekKeys.map((weekKey, index) => {
                    const weekData = localPlan[weekKey];
                    const isOpen = openWeek === weekKey;
                    const completedCount = weekData.tasks.filter(t => t.completed).length;
                    const totalCount = weekData.tasks.length;
                    const isFullyComplete = totalCount > 0 && completedCount === totalCount;
                    const weekTotalXp = weekData.tasks.reduce((acc, curr) => acc + (curr.xp || 0), 0);

                    return (
                        <div key={weekKey} className={`bg-white rounded-xl border transition-all ${isOpen ? 'border-indigo-200 shadow-md' : 'border-slate-200'}`}>
                            <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
                                onClick={() => setOpenWeek(isOpen ? null : weekKey)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                        isFullyComplete 
                                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200' 
                                        : 'bg-white text-slate-400 border-slate-200'
                                    }`}>
                                        {isFullyComplete ? <div className="icon-check"></div> : (index + 1)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-bold capitalize ${isOpen ? 'text-indigo-900' : 'text-slate-700'}`}>{weekKey.replace('week', 'Week ')}</h4>
                                            {weekData.focus_skills && (
                                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 border border-slate-200 truncate max-w-[150px]">
                                                    {weekData.focus_skills.join(", ")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                                            <span>{completedCount}/{totalCount} Tasks</span>
                                            <span>{weekTotalXp} XP</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`icon-chevron-down text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></div>
                            </div>

                            {isOpen && (
                                <div className="border-t border-slate-100 p-2">
                                    {weekData.tasks.map((task, i) => (
                                        <div 
                                            key={task.id || i} 
                                            className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg mb-1 last:mb-0 transition-all gap-3 ${
                                                task.completed ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <button 
                                                    onClick={() => toggleTask(weekKey, task.id, task.xp)}
                                                    className={`mt-0.5 w-5 h-5 min-w-[20px] rounded border flex items-center justify-center transition-colors ${
                                                        task.completed 
                                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                        : 'bg-white border-slate-300 hover:border-indigo-400'
                                                    }`}
                                                >
                                                    {task.completed && <div className="icon-check text-xs"></div>}
                                                </button>
                                                <div>
                                                    <span className={`text-sm font-medium block ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                        {task.name}
                                                    </span>
                                                    {task.deliverable && (
                                                        <span className="text-xs text-slate-400 block mt-1">
                                                            Deliverable: {task.deliverable}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pl-8 md:pl-0">
                                                {task.resource && (
                                                    <a href={task.resource} target="_blank" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1">
                                                        Learn <div className="icon-external-link text-[10px]"></div>
                                                    </a>
                                                )}
                                                <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 whitespace-nowrap">
                                                    +{task.xp || 50} XP
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {localPlan.capstone && (
                    <div className="mt-6 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <div className="icon-trophy text-amber-400 text-xl"></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Capstone: {localPlan.capstone.title}</h4>
                                <p className="text-sm text-indigo-200 mt-1 mb-3">{localPlan.capstone.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {localPlan.capstone.skills && localPlan.capstone.skills.map(s => (
                                        <span key={s} className="text-[10px] font-bold bg-black/30 px-2 py-1 rounded border border-white/10">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}