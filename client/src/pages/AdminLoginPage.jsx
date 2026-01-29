import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/UI/PageTransition';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminLogin(password);
            toast.success("Welcome Admin");
            // No navigation needed, parent component will re-render
        } catch (err) {
            console.error(err);
            toast.error('Invalid Admin Password');
            setLoading(false); // Only stop loading on error, on success component unmounts
        }
    };

    return (
        <PageTransition>
            <div className="flex items-center justify-center min-h-[80vh] relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-10 rounded-3xl max-w-sm w-full text-center border border-primary/20 shadow-2xl"
                >
                    <h1 className="text-3xl font-serif text-primary mb-6">Admin Access</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="password"
                            placeholder="Admin Passcode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500/50 transition-all text-center text-xl tracking-widest placeholder:text-gray-600"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors uppercase tracking-widest"
                        >
                            {loading ? "Verifying..." : "Dashboard"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default AdminLoginPage;
