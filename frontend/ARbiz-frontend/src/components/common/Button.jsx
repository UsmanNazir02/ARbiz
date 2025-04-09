export function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) {
    const baseClasses = "font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
        outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}