import { Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { useState, useRef } from 'react';

const HomePage = () => {
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef(null);

    const handlePlayVideo = () => {
        setShowVideo(true);
        videoRef.current?.play();
    };
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] bg-repeat"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                        <div className="text-center relative z-10">
                            <h1 className="text-5xl font-extrabold text-white sm:text-6xl sm:tracking-tight lg:text-7xl">
                                <span className="block">Transform Your</span>
                                <span className="block text-indigo-200">Business Connections</span>
                            </h1>
                            <p className="max-w-2xl mt-5 mx-auto text-xl text-indigo-100">
                                Revolutionize networking with interactive AR visiting cards that leave lasting impressions.
                            </p>
                            <div className="mt-10 flex justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 rounded-xl text-lg font-medium text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Get Started - It's Free
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 rounded-xl text-lg font-medium text-indigo-100 bg-transparent hover:bg-indigo-700 hover:bg-opacity-20 border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 transition-colors"
                                >
                                    Request Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Powerful Features
                            </h2>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                                Everything you need to modernize your business networking
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-shadow">
                                <div className="px-6 py-8 sm:p-10">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100 text-blue-600 mx-auto">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">3D Visualization</h3>
                                    <p className="mt-4 text-base text-gray-600 text-center">
                                        Create stunning 3D models of your business card that captivate your audience and make you stand out.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-shadow">
                                <div className="px-6 py-8 sm:p-10">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-green-100 text-green-600 mx-auto">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">Interactive Elements</h3>
                                    <p className="mt-4 text-base text-gray-600 text-center">
                                        Add clickable links, videos, and interactive components that engage your connections.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-shadow">
                                <div className="px-6 py-8 sm:p-10">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-purple-100 text-purple-600 mx-auto">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 text-center">Easy Integration</h3>
                                    <p className="mt-4 text-base text-gray-600 text-center">
                                        Seamlessly connect with your existing digital profiles and content management systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section className="py-20 bg-gradient-to-r from-gray-50 to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                    <span className="block">See it in action</span>
                                    <span className="block text-indigo-600">Experience ARbiz</span>
                                </h2>
                                <p className="mt-3 text-lg text-gray-500 sm:mt-4">
                                    Watch how ARbiz transforms traditional business cards into immersive digital experiences.
                                </p>
                                <div className="mt-10">
                                    <Link
                                        to="/pricing"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        View Pricing
                                        <svg className="ml-3 -mr-1 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>


                            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                                <div className="relative mx-auto w-full rounded-xl overflow-hidden shadow-2xl lg:max-w-2xl">
                                    <div className="aspect-w-16 aspect-h-9 bg-indigo-900">
                                        {!showVideo ? (
                                            <div
                                                className="relative w-full h-full cursor-pointer group"
                                                onClick={handlePlayVideo}
                                            >
                                                {/* SVG Thumbnail */}
                                                <svg
                                                    className="w-full h-full object-cover"
                                                    viewBox="0 0 800 450"
                                                    preserveAspectRatio="xMidYMid slice"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    {/* Background gradient */}
                                                    <rect width="100%" height="100%" fill="url(#gradient)" />
                                                    <defs>
                                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#4f46e5" />
                                                            <stop offset="100%" stopColor="#7c3aed" />
                                                        </linearGradient>
                                                    </defs>

                                                    {/* ARbiz Logo */}
                                                    <g transform="translate(400, 225)" className="group-hover:scale-110 transition-transform duration-300">
                                                        <circle r="80" fill="white" fillOpacity="0.1" />
                                                        <text
                                                            x="0"
                                                            y="0"
                                                            fill="white"
                                                            fontSize="60"
                                                            fontWeight="bold"
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            AR
                                                        </text>
                                                        <text
                                                            x="0"
                                                            y="40"
                                                            fill="white"
                                                            fontSize="20"
                                                            fontWeight="bold"
                                                            textAnchor="middle"
                                                        >
                                                            biz
                                                        </text>
                                                    </g>

                                                    {/* Play Button */}
                                                    <g transform="translate(400, 225)" className="group-hover:opacity-100 opacity-90 transition-opacity">
                                                        <circle r="50" fill="white" fillOpacity="0.9" />
                                                        <path
                                                            d="M-15,-20 L25,0 L-15,20 Z"
                                                            fill="#4f46e5"
                                                        />
                                                    </g>

                                                    {/* Bottom Text */}
                                                    <text
                                                        x="400"
                                                        y="380"
                                                        fill="white"
                                                        fontSize="24"
                                                        fontWeight="semibold"
                                                        textAnchor="middle"
                                                    >
                                                        Watch Demo
                                                    </text>
                                                </svg>
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                className="w-full h-full object-contain"
                                                controls
                                                autoPlay
                                                playsInline
                                                poster="/src/assets/video-thumbnail.jpg" // Fallback image
                                                onEnded={() => setShowVideo(false)}
                                            >
                                                <source src="/src/assets/AR Business Card.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Trusted by professionals worldwide
                            </h2>
                        </div>
                        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Testimonial 1 */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="p-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="h-12 w-12 rounded-full" src="/src/assets/testimonial1.jpg" alt="Sarah Johnson" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                                            <p className="text-gray-500">Marketing Director, TechCorp</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        "ARbiz has completely transformed how we network at conferences. Our AR cards get 5x more engagement than traditional cards."
                                    </p>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="p-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="h-12 w-12 rounded-full" src="/src/assets/testimonial2.jpg" alt="Michael Chen" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                                            <p className="text-gray-500">Founder, StartupX</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        "The interactive elements in our AR cards have significantly increased follow-up meetings. It's been a game-changer for our sales team."
                                    </p>
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="p-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="h-12 w-12 rounded-full" src="/src/assets/testimonial3.jpg" alt="Emma Rodriguez" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Emma Rodriguez</h3>
                                            <p className="text-gray-500">Creative Director, DesignHub</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        "Our clients love the 3D visualization feature. It perfectly represents our creative agency's innovative approach."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-indigo-700">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">Ready to revolutionize your networking?</span>
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto">
                            Join thousands of professionals who are making lasting impressions with ARbiz.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-4 rounded-xl text-lg font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Get Started for Free
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-4 rounded-xl text-lg font-medium text-white bg-transparent hover:bg-indigo-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 transition-colors"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Features</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Demo</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Guides</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">API Status</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookie Policy</a></li>
                                <li><a href="#" className="text-base text-gray-300 hover:text-white">GDPR</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-base text-gray-400 text-center md:text-left">
                            &copy; 2025 ARbiz. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;