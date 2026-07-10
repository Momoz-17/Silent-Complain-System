import React, { useState } from 'react';

const SafetyTips = () => {
    const [showNumbers, setShowNumbers] = useState(false);

    const emergencyNumbers = [
        { service: "National Emergency", number: "112", description: "All-in-one emergency services" },
        { service: "Police Assistance", number: "100", description: "Direct law enforcement communication" },
        { service: "Women Helpline", number: "1091", description: "Dedicated line for women's safety" },
        { service: "Fire Station", number: "101", description: "Fire rescue and accident response" },
        { service: "Ambulance Desk", number: "102", description: "Immediate medical crises" },
        { service: "Cyber Crime", number: "1930", description: "Reporting digital or financial scams" }
    ];

    const tips = [
        {
            category: "Harassment",
            icon: "🛡️",
            gradient: "from-red-50 to-white hover:border-red-200",
            iconBg: "bg-red-500/10 text-red-600",
            dotColor: "bg-red-500",
            steps: [
                "Trust your instincts: If a person or place feels unsafe, leave immediately.",
                "Maintain a safe distance and use a firm, clear voice to set boundaries.",
                "Identify 'Safe Zones': Know the locations of security desks or well-lit public areas.",
                "The Buddy System: Try to travel with a companion, especially during late hours."
            ]
        },
        {
            category: "Physical Safety",
            icon: "🔦",
            gradient: "from-orange-50 to-white hover:border-orange-200",
            iconBg: "bg-orange-500/10 text-orange-600",
            dotColor: "bg-orange-500",
            steps: [
                "Stay Aware: Avoid using headphones or being distracted by your phone in isolated areas.",
                "Keep emergency contacts on speed dial or use your phone's SOS shortcut.",
                "Walk with confidence and keep your head up to show situational awareness.",
                "Report broken streetlights or faulty locks immediately via our dashboard."
            ]
        },
        {
            category: "Cleanliness & Health",
            icon: "🧼",
            gradient: "from-blue-50 to-white hover:border-blue-200",
            iconBg: "bg-blue-500/10 text-blue-600",
            dotColor: "bg-blue-500",
            steps: [
                "Waste Disposal: Always use designated bins; overflowing trash attracts health hazards.",
                "Report Spills: Slippery floors are a major cause of campus accidents.",
                "Sanitization: Use hand sanitizer after touching high-contact shared surfaces.",
                "Community Care: If you see a hygiene hazard, report it anonymously right away."
            ]
        },
        {
            category: "Fire & Emergency",
            icon: "🔥",
            gradient: "from-amber-50 to-white hover:border-amber-200",
            iconBg: "bg-amber-500/10 text-amber-600",
            dotColor: "bg-amber-500",
            steps: [
                "Know your exits: Locate the two nearest fire exits in every building.",
                "Keep pathways clear: Never block corridors or access to fire extinguishers.",
                "In case of smoke: Stay low to the ground where the air is cleaner.",
                "Evacuate immediately when an alarm sounds; never utilize lifts or elevators."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 sm:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-16 relative">
                    <span className="px-4 py-1.5 bg-red-50 text-red-600 font-bold rounded-full text-xs uppercase tracking-widest border border-red-100">
                        Information Center
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-4 mb-4 tracking-tight">
                        Safety & Prevention Guide
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium text-base sm:text-lg">
                        Your physical security is our community priority. Follow these guidelines to stay protected and maintain a stable environment.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {tips.map((section, index) => (
                        <div 
                            key={index} 
                            className={`bg-gradient-to-br ${section.gradient} rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1`}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`text-2xl p-3 rounded-2xl ${section.iconBg} font-bold shadow-inner group-hover:scale-110 transition-transform`}>
                                    {section.icon}
                                </span>
                                <h2 className="text-xl font-extrabold tracking-wide text-gray-800">
                                    {section.category}
                               </h2>
                            </div>
                            <ul className="space-y-4">
                                {section.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3.5 text-gray-600 items-start font-medium leading-relaxed">
                                        <span className={`w-2 h-2 rounded-full ${section.dotColor} mt-2.5 shrink-0 shadow-sm`}></span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Emergency Card Segment */}
                <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-red-100 shadow-xl shadow-red-50/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Immediate Assistance Needed?</h3>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto font-medium">
                        If you are experiencing direct risk, harm, or a real-time crisis, call critical infrastructure services instantly.
                    </p>
                    
                    <button 
                        onClick={() => setShowNumbers(!showNumbers)}
                        className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-red-600/20 hover:shadow-red-600/30 transition-all duration-300 transform active:scale-95 text-sm sm:text-base tracking-wide"
                    >
                        {showNumbers ? "Hide Quick Emergency Dialers" : "View Emergency Contact Matrix"}
                    </button>

                    {/* Expandable Responsive Contact System */}
                    {showNumbers && (
                        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-6 duration-300">
                            {emergencyNumbers.map((item, idx) => (
                                <div key={idx} className="bg-gray-50/60 hover:bg-white p-5 rounded-2xl border border-gray-100 hover:border-red-200 shadow-sm text-left transition-all duration-300 group">
                                    <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.service}</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-3xl font-black text-red-600 group-hover:text-red-700 tracking-tight">{item.number}</span>
                                        <a href={`tel:${item.number}`} className="bg-white p-2.5 rounded-xl border border-gray-100 group-hover:bg-green-50 group-hover:text-green-600 text-gray-500 transition-all duration-300 shadow-sm group-hover:shadow">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.454 5.454l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </a>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2 line-clamp-1 font-medium italic">{item.description}</p>
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