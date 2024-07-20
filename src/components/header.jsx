import { useState } from "react";

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-blue-600 text-white mb-8">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="text-lg font-bold">MyLogo</div>
                <nav className="hidden md:flex space-x-4">
                    <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                        Capture
                    </a>
                    <a
                        href="/slider"
                        className="hover:bg-blue-700 px-3 py-2 rounded"
                    >
                        Slider
                    </a>
                </nav>
                <button
                    className="block md:hidden text-white focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </div>
            <div
                className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
            >
                <nav className="space-y-2 px-4 py-2">
                    <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                        Capture
                    </a>
                    <a
                        href="/slider"
                        className="hover:bg-blue-700 px-3 py-2 rounded"
                    >
                        Slider
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
