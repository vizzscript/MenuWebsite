import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const shouldShowUser = user && (user.name || user.mobileNumber) && (!isAdminPath || user.isAdmin);

    const handleLogout = () => {
        const isAdminPath = location.pathname.startsWith('/admin');
        logout();
        navigate(isAdminPath ? '/admin' : '/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-dark text-light flex flex-col font-sans selection:bg-primary selection:text-black">
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-serif font-bold text-lg">E</div>
                        <span className="text-xl font-serif font-bold text-primary tracking-widest">ELIXIR</span>
                    </motion.div>

                    {shouldShowUser && (
                        <div className="flex items-center gap-6">
                            <span className="hidden md:block text-gray-400 text-xs uppercase tracking-widest border-r border-gray-700 pr-6">
                                {user.name || (user.mobileNumber !== 'admin' ? user.mobileNumber : 'Admin')}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-wider group"
                            >
                                <span className="hidden sm:inline group-hover:underline underline-offset-4">Logout</span>
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow pt-24 px-4 sm:px-6">
                {children || <Outlet />}
            </main>

            <footer className="bg-black/40 border-t border-white/5 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-serif text-primary mb-4">ELIXIR</h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                        Experience the finest collection of premium spirits.
                        Curated for the connoisseur in you.
                    </p>
                    <p className="text-gray-700 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Elixir Liquor Menu. Please Drink Responsibly.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
