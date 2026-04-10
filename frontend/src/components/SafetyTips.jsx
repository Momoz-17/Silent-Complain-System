import React, { useState } from 'react';

const SafetyTips = () => {
    const [showNumbers, setShowNumbers] = useState(false);

    const emergencyNumbers = [
        { service: "National Emergency Number", number: "112", description: "All-in-one emergency services" },
        { service: "Police", number: "100", description: "Direct police assistance" },
        { service: "Women Helpline", number: "1091", description: "Dedicated line for women's safety" },
        { service: "Fire Station", number: "101", description: "Fire and rescue services" },
        { service: "Ambulance", number: "102", description: "Medical emergencies" },
        { service: "Cyber Crime", number: "1930", description: "Reporting financial or online fraud" }
    ];

    const tips = [
        {
            category: "Harassment",
            icon: "🛡️",
            color: "red",
            steps: [
                "Trust your instincts: If a person or place feels unsafe, leave immediately.",
                "Maintain a safe distance and use a firm, clear voice to set boundaries.",
                "Identify 'Safe Zones': Know the locations of security desks or well-lit public areas.",
                "The Buddy System: Try to travel with a friend, especially during late hours."
            ]
        },
        {
            category: "Physical Safety",
            icon: "🔦",
            color: "orange",
            steps: [
                "Stay Aware: Avoid using headphones or being distracted by your phone in isolated areas.",
                "Keep emergency contacts on speed dial or use your phone's SOS shortcut.",
                "Walk with confidence and keep your head up to show situational awareness.",
                "Report broken streetlights or faulty locks immediately via our portal."
            ]
        },
        {
            category: "Cleanliness & Health",
            icon: "🧼",
            color: "blue",
            steps: [
                "Waste Disposal: Always use designated bins; overflowing trash attracts pests.",
                "Report Spills: Slippery floors are a major cause of campus accidents.",
                "Sanitization: Use hand sanitizer after touching high-contact surfaces.",
                "Community Care: If you see a hygiene hazard, report it anonymously."
            ]
        },
        {
            category: "Fire & Emergency",
            icon: "🔥",
            color: "yellow",
            steps: [
                "Know your exits: Locate the two nearest fire exits in every building.",
                "Keep pathways clear: Never block corridors or fire extinguishers.",
                "In case of smoke: Stay low to the ground where the air is cleaner.",
                "Evacuate immediately when an alarm sounds; never use elevators."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Safety & Prevention Guide</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your safety is our priority. Follow these guidelines to stay protected and help maintain a healthy community environment.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {tips.map((section, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl">{section.icon}</span>
                                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                                    {section.category}
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {section.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-gray-700 items-start">
                                        <span className="text-red-500 mt-1">•</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* EMERGENCY SECTION */}
                <div className="mt-12 bg-red-50 rounded-xl p-8 border border-red-100 text-center">
                    <h3 className="text-red-700 font-bold text-lg mb-2">Emergency?</h3>
                    <p className="text-red-600 mb-6">If you are in immediate danger, please contact local emergency services or campus security directly.</p>
                    
                    <button 
                        onClick={() => setShowNumbers(!showNumbers)}
                        className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 shadow-lg transition-all transform active:scale-95"
                    >
                        {showNumbers ? "Hide Emergency Contacts" : "View Indian Emergency Contacts"}
                    </button>

                    {/* SLIDE DOWN NUMBERS LIST */}
                    {showNumbers && (
                        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            {emergencyNumbers.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm text-left">
                                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.service}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-2xl font-black text-red-600">{item.number}</span>
                                        <a href={`tel:${item.number}`} className="bg-gray-100 p-2 rounded-full hover:bg-green-100 text-green-600 transition">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.454 5.454l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </a>
                                    </div>
                                    <p className="text-gray-400 text-[10px] mt-1 italic">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default SafetyTips;