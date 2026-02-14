function Recalibration({ onRecalibrate }) {
    const [isRecalibrating, setIsRecalibrating] = React.useState(false);

    const handleRecalibrate = () => {
        setIsRecalibrating(true);
        setTimeout(() => {
            setIsRecalibrating(false);
            onRecalibrate();
        }, 2500); // Fake delay
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
            {isRecalibrating && (
                <div className="absolute bottom-full right-0 mb-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap animate-pulse flex items-center gap-2">
                    <div className="icon-loader animate-spin"></div>
                    AI is recalculating your growth trajectory...
                </div>
            )}
            
            <button 
                onClick={handleRecalibrate}
                disabled={isRecalibrating}
                className={`flex items-center gap-2 px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 font-bold text-white
                    ${isRecalibrating ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                `}
            >
                <div className={`icon-refresh-cw text-xl ${isRecalibrating ? 'animate-spin' : ''}`}></div>
                <span className="hidden md:inline">Recalibrate Progress</span>
            </button>
        </div>
    );
}