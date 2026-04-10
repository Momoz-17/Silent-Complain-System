import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-red-50 to-white">
                <div className="mx-auto max-w-2xl py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Speak Up, <span className="text-red-600">Stay Anonymous.</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Silent Complaint is a secure platform designed for students and community members to report safety, harassment, and cleanliness issues without fear of retaliation.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/report"
                                className="rounded-full bg-red-600 px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
                            >
                                Report an Issue
                            </Link>
                            <Link to="/safety-tips" className="text-sm font-semibold leading-6 text-gray-900">
                                View Safety Tips <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How Silent Complaint Works</h2>
                        <p className="mt-4 text-gray-600">Our priority is your privacy and the community's safety.</p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100 text-red-600 text-2xl">📝</div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">Submit Your Report</dt>
                                <dd className="mt-1 text-base leading-7 text-gray-600">Fill out the form with details and evidence. You don't need to provide your name or ID.</dd>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100 text-red-600 text-2xl">🔒</div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">Encrypted Anonymity</dt>
                                <dd className="mt-1 text-base leading-7 text-gray-600">Your identity is shielded. Only the content of the report reaches the administration.</dd>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100 text-red-600 text-2xl">⚡</div>
                                <dt className="text-xl font-bold leading-7 text-gray-900">Swift Action</dt>
                                <dd className="mt-1 text-base leading-7 text-gray-600">Administrators review the case and mark it resolved once the issue is addressed.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;