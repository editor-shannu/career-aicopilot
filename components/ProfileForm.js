function ProfileForm({ onComplete }) {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        resume: '',
        github: '',
        linkedin: '',
        currentLevel: 'Junior',
        hours: '',
        dreamRole: '',
        companyType: 'Startup'
    });
    const [errors, setErrors] = React.useState({});

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.resume.trim()) newErrors.resume = "Resume text is required";
        if (!formData.hours || isNaN(formData.hours) || formData.hours < 1 || formData.hours > 12) {
            newErrors.hours = "Please enter valid hours (1-12)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.dreamRole.trim()) newErrors.dreamRole = "Dream role is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = () => {
        if (validateStep2()) {
            onComplete(formData);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {step === 1 ? "1. Career Diagnostics" : "2. Target Calibration"}
                    </h2>
                    <div className="flex gap-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    </div>
                </div>
                
                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="label">Paste Resume / CV Text <span className="text-red-500">*</span></label>
                                <textarea 
                                    name="resume"
                                    rows="4" 
                                    className={`input-field ${errors.resume ? 'border-red-500' : ''}`}
                                    placeholder="Paste your resume content here for AI analysis..."
                                    value={formData.resume}
                                    onChange={handleChange}
                                ></textarea>
                                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">GitHub URL</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3.5 text-slate-400 icon-github"></div>
                                        <input 
                                            type="text" 
                                            name="github"
                                            className="input-field pl-10" 
                                            placeholder="github.com/username"
                                            value={formData.github}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">LinkedIn Summary</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3.5 text-slate-400 icon-linkedin"></div>
                                        <input 
                                            type="text" 
                                            name="linkedin"
                                            className="input-field pl-10" 
                                            placeholder="Brief summary..."
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Current Level</label>
                                    <select 
                                        name="currentLevel"
                                        className="input-field appearance-none bg-white" 
                                        value={formData.currentLevel}
                                        onChange={handleChange}
                                    >
                                        <option>Student</option>
                                        <option>Junior</option>
                                        <option>Mid-Level</option>
                                        <option>Senior</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Daily Hours Available <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        name="hours"
                                        className={`input-field ${errors.hours ? 'border-red-500' : ''}`} 
                                        placeholder="e.g. 2"
                                        min="1" max="12"
                                        value={formData.hours}
                                        onChange={handleChange}
                                    />
                                    {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours}</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button onClick={handleNext} className="btn btn-primary w-full md:w-auto">
                                    Start Career Diagnosis <span className="icon-arrow-right"></span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                                <div className="icon-sparkles text-indigo-600 mt-1"></div>
                                <p className="text-sm text-indigo-800">Great! Now let's define where you want to go. Our AI will map the shortest path between your current profile and this dream role.</p>
                            </div>

                            <div>
                                <label className="label">Dream Role <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="dreamRole"
                                    className={`input-field ${errors.dreamRole ? 'border-red-500' : ''}`}
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={formData.dreamRole}
                                    onChange={handleChange}
                                />
                                {errors.dreamRole && <p className="text-red-500 text-sm mt-1">{errors.dreamRole}</p>}
                            </div>

                            <div>
                                <label className="label">Target Company Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Startup', 'MNC', 'FAANG', 'Research'].map(type => (
                                        <div 
                                            key={type}
                                            onClick={() => setFormData({...formData, companyType: type})}
                                            className={`cursor-pointer px-4 py-3 rounded-xl border transition-all text-center font-medium ${
                                                formData.companyType === type 
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                                                : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                                            }`}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button onClick={() => setStep(1)} className="text-slate-500 font-medium hover:text-slate-800">
                                    Back
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    Generate My Career Blueprint <span className="icon-wand-sparkles"></span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}