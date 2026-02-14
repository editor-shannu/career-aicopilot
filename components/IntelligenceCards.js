function IntelligenceCards({ stats }) {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new ChartJS(ctx, {
                type: 'radar',
                data: {
                    labels: ['Technical', 'Soft Skills', 'Leadership', 'System Design', 'Algorithms', 'Communication'],
                    datasets: [{
                        label: 'Current Skills',
                        data: [stats.technical, stats.softSkills, 45, 60, 50, 85],
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 2,
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(0,0,0,0.05)' },
                            grid: { color: 'rgba(0,0,0,0.05)' },
                            pointLabels: {
                                font: { size: 10, family: 'Plus Jakarta Sans' },
                                color: '#64748b'
                            },
                            ticks: { display: false },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }
        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [stats]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Card 1 - Overview */}
            <div className="card flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Readiness Overview</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-extrabold text-slate-900">{stats.readiness}</span>
                        <span className="text-sm font-medium text-slate-400 mb-2">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${stats.readiness}%` }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-500 text-xs">Technical</div>
                        <div className="font-bold text-slate-800">{stats.technical}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-500 text-xs">Soft Skill</div>
                        <div className="font-bold text-slate-800">{stats.softSkills}</div>
                    </div>
                </div>
            </div>

            {/* Card 2 - Radar Chart */}
            <div className="card relative min-h-[220px]">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider absolute top-6 left-6 z-10">Skill Radar</h3>
                <div className="w-full h-full pt-6">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>

            {/* Card 3 - Risk Analysis */}
            <div className="card border-l-4 border-l-emerald-500">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Career Risk Analysis</h3>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <div className="icon-shield-check text-xl"></div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{stats.successProb}%</div>
                        <div className="text-xs text-slate-500">Success Probability</div>
                    </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                    Your profile is strong for startups. Focus on showcasing system design skills to increase probability for MNCs.
                </p>
            </div>

            {/* Card 4 - Growth Metrics */}
            <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current Level</h3>
                    <div className="icon-award text-amber-400"></div>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.level}</div>
                <div className="text-sm text-slate-400 mb-6">Next: {window.getLevelInfo(stats.readiness + 20).name}</div>
                
                <div className="mt-auto">
                    <div className="flex justify-between text-xs mb-2 text-slate-300">
                        <span>XP Progress</span>
                        <span>{Math.floor((stats.xp/stats.nextLevelXp)*100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${(stats.xp/stats.nextLevelXp)*100}%` }}></div>
                    </div>
                </div>
            </div>

        </div>
    );
}