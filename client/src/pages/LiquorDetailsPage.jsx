import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiHeart, FiShare2 } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import PageTransition from '../components/UI/PageTransition';
import { useAuth } from '../context/AuthContext';
import { createOrder, getLiquorById } from '../services/liquorService';

const LiquorDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [liquor, setLiquor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // null, 'success', 'error'

    useEffect(() => {
        const fetchLiquor = async () => {
            try {
                const data = await getLiquorById(id);
                setLiquor(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiquor();
    }, [id]);

    const handleOrder = async () => {
        if (!user) {
            toast.error("Please login to place an order");
            return;
        }
        console.log("Ordering with user:", user); // Debug
        setOrdering(true);
        try {
            await createOrder({ userId: user._id, liquorId: liquor._id });
            setOrderStatus('success');
            toast.success("Order request sent successfully!");
            setTimeout(() => setOrderStatus(null), 3000); // Reset after 3s
        } catch (error) {
            console.error("Order failed", error);
            setOrderStatus('error');
            toast.error("Failed to place order. Is the backend running?");
        } finally {
            setOrdering(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!liquor) return <div className="text-center py-20 text-red-500">Liquor not found.</div>;

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-8">
                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors group">
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Menu
                    </Link>
                    <div className="flex gap-4">
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <FiHeart />
                        </button>
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <FiShare2 />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative group rounded-3xl overflow-hidden shadow-2xl bg-secondary aspect-[4/5]"
                    >
                        {liquor.imageUrl ? (
                            <img
                                src={liquor.imageUrl}
                                alt={liquor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-secondary-800">No Image</div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 ${liquor.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {liquor.isAvailable ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col h-full justify-center"
                    >
                        <div className="mb-2">
                            <span className="text-primary tracking-[0.2em] text-sm font-bold uppercase">{liquor.category}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 leading-tight">{liquor.name}</h1>
                        <p className="text-2xl text-gray-400 mb-8 font-light">{liquor.brand}</p>

                        <div className="glass p-8 rounded-2xl border border-white/5 mb-10 space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-gray-500 uppercase tracking-wider text-sm">Alcohol Content</span>
                                <span className="text-xl text-white font-serif">{liquor.alcoholPercentage}%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-gray-500 uppercase tracking-wider text-sm">Volume</span>
                                <span className="text-xl text-white font-serif">750ml</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 uppercase tracking-wider text-sm">Availability</span>
                                <span className={liquor.isAvailable ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                                    {liquor.isAvailable ? "Available Now" : "Currently Unavailable"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Price</p>
                                <p className="text-6xl font-serif text-primary">₹{liquor.price}</p>
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={ordering || !liquor.isAvailable || orderStatus === 'success'}
                                className={`px-10 py-5 rounded-full font-bold uppercase tracking-widest transition-all shadow-lg text-black
                                    ${orderStatus === 'success'
                                        ? 'bg-green-500 hover:bg-green-400'
                                        : 'bg-white hover:bg-gray-200 hover:shadow-white/20'
                                    } ${ordering || !liquor.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {ordering ? 'Placing Order...' : orderStatus === 'success' ? 'Request Sent!' : 'Interested'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default LiquorDetailsPage;
