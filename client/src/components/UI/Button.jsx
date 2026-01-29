import { twMerge } from 'tailwind-merge';

const Button = ({ children, className, ...props }) => {
    return (
        <button
            className={twMerge(
                "bg-primary text-black font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
