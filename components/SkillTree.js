function SkillTree({ role }) {
    const [expanded, setExpanded] = React.useState(true);
    
    // Status colors helper
    const getStatusColor = (status) => {
        switch(status) {
            case 'strong': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'underdeveloped': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'missing': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'strong': return 'icon-check';
            case 'underdeveloped': return 'icon-hourglass';
            case 'missing': return 'icon-circle-alert';
            default: return 'icon-circle';
        }
    };

    return (
        <div className="card mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="icon-git-branch text-indigo-600"></div>
                    Target Role Skill Tree
                </h3>
                <button 
                    onClick={() => setExpanded(!expanded)} 
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <div className={`icon-chevron-down transform transition-transform ${expanded ? 'rotate-180' : ''}`}></div>
                </button>
            </div>

            {expanded && (
                <div className="relative pl-4 md:pl-8 border-l-2 border-indigo-100 space-y-8">
                    
                    {/* Root Node */}
                    <div className="relative">
                        <div className="absolute -left-[34px] md:-left-[42px] top-3 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm ring-1 ring-indigo-100"></div>
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-lg">
                            <div className="icon-target text-amber-400"></div>
                            <span className="font-semibold">{role || "Senior Frontend Engineer"}</span>
                        </div>
                    </div>

                    {/* Core Skills Branch */}
                    <div className="relative pt-2">
                        <div className="absolute -left-[25px] md:-left-[33px] top-6 w-6 h-0.5 bg-indigo-100"></div>
                        <div className="mb-4 text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <div className="icon-code text-slate-400"></div>
                            Core Technical Skills
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {window.initialSkillTree.core.map((skill, i) => (
                                <div key={i} className={`px-3 py-2 rounded-lg border flex items-center justify-between ${getStatusColor(skill.status)}`}>
                                    <span className="font-medium text-sm">{skill.name}</span>
                                    <div className={`${getStatusIcon(skill.status)} text-base opacity-70`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Soft Skills Branch */}
                    <div className="relative pt-2">
                        <div className="absolute -left-[25px] md:-left-[33px] top-6 w-6 h-0.5 bg-indigo-100"></div>
                        <div className="mb-4 text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <div className="icon-users text-slate-400"></div>
                            Soft Skills & Leadership
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {window.initialSkillTree.soft.map((skill, i) => (
                                <div key={i} className={`px-3 py-2 rounded-lg border flex items-center justify-between ${getStatusColor(skill.status)}`}>
                                    <span className="font-medium text-sm">{skill.name}</span>
                                    <div className={`${getStatusIcon(skill.status)} text-base opacity-70`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}