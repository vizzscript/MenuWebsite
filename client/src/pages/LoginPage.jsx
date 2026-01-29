import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/UI/PageTransition';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mobileNumber.length < 10) {
            setError('Please enter a valid mobile number');
            return;
        }
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        setLoading(true);
        try {
            await login(mobileNumber, name);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex items-center justify-center min-h-[80vh] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="glass p-10 rounded-3xl max-w-md w-full text-center relative z-10 border border-white/10 shadow-2xl"
                >
                    <div className="mb-8">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block mb-4 p-3 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </motion.div>
                        <h1 className="text-5xl font-serif text-white mb-2 tracking-tight">ELIXIR</h1>
                        <p className="text-primary/80 uppercase tracking-[0.3em] text-xs font-bold">Premium Liquor Collection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-center text-xl tracking-widest placeholder:text-gray-600 mb-4 group-hover:border-white/20"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Enter Mobile Number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-center text-xl tracking-widest placeholder:text-gray-600 group-hover:border-white/20"
                                required
                            />
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm mt-3 bg-red-400/10 py-1 px-3 rounded-lg inline-block"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-yellow-400 text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Entering...
                                </span>
                            ) : (
                                "Explore Menu"
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default LoginPage;
