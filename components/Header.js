function Header({ stats, user }) {
    const levelInfo = window.getLevelInfo(stats.readiness);
    const [showMenu, setShowMenu] = React.useState(false);
    
    // XP Progress width calculation
    const xpPercent = Math.min(100, (stats.xp / stats.nextLevelXp) * 100);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Brand & Level */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <div className="icon-rocket text-xl"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Career Co-Pilot AI</h1>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${levelInfo.bg} ${levelInfo.color} border border-current opacity-90`}>
                                    {levelInfo.name}
                                </span>
                                <span className="text-xs text-slate-400">Level {Math.floor(stats.xp / 1000) + 1}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & User Profile */}
                    <div className="flex flex-1 md:justify-end gap-3 md:gap-8 items-center overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        
                        {/* Stats Group (Only show if stats exist) */}
                        {stats && (
                            <>
                                <div className="flex items-center gap-3 min-w-max">
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                                className="text-indigo-600 transition-all duration-1000 ease-out"
                                                strokeDasharray={2 * Math.PI * 20}
                                                strokeDashoffset={2 * Math.PI * 20 * (1 - stats.readiness / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-sm font-bold text-slate-800">{stats.readiness}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 font-medium uppercase">Readiness</span>
                                        <span className="text-sm font-bold text-slate-900">{stats.readiness}%</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center min-w-[140px] md:min-w-[200px]">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-amber-500">XP {stats.xp}</span>
                                        <span className="text-slate-400">/ {stats.nextLevelXp}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                            style={{ width: `${xpPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* User Profile Dropdown */}
                        {user && (
                            <div className="relative border-l pl-4 md:pl-8 border-slate-100 ml-auto md:ml-0">
                                <button 
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors"
                                >
                                    <img 
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                                        alt={user.displayName} 
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                    />
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-bold text-slate-800">{user.displayName}</div>
                                        <div className="text-xs text-slate-500">Dashboard</div>
                                    </div>
                                    <div className="icon-chevron-down text-slate-400 text-xs"></div>
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                                            <div className="font-bold text-slate-800">{user.displayName}</div>
                                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setShowMenu(false);
                                                window.handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <div className="icon-log-out"></div>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </header>
    );
}