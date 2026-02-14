function LoginScreen({ onLogin }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleLoginClick = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await window.handleGoogleLogin();
            if (user) {
                // Login successful (Popup)
                // App.js listener will handle redirect
            } else {
                // Redirect happened, page will reload or listener will catch it
            }
        } catch (err) {
            console.error("Login Error UI caught:", err);
            setError("Unable to sign in. Please try again or check your popup blocker settings.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-indigo-900 p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <div className="icon-rocket text-3xl text-white"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Career Co-Pilot AI</h1>
                    <p className="text-indigo-200 text-sm">Your intelligent companion for career growth.</p>
                </div>
                
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 text-sm">Sign in to access your personalized roadmap and career intelligence dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <div className="icon-circle-alert min-w-[16px]"></div>
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        onClick={handleLoginClick}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="icon-loader animate-spin text-slate-500"></div>
                        ) : (
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        )}
                        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                    </button>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}