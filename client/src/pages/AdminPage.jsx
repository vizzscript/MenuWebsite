import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheck, FiChevronDown, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import ConfirmModal from '../components/UI/ConfirmModal';
import PageTransition from '../components/UI/PageTransition';
import { useAuth } from '../context/AuthContext';
import { createLiquor, deleteLiquor, getLiquors, getOrders, updateLiquor, updateOrderStatus } from '../services/liquorService';
import AdminLoginPage from './AdminLoginPage';

const AdminPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'
    const [orders, setOrders] = useState([]);
    const [liquors, setLiquors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Inventory Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', brand: '', category: 'Whisky',
        alcoholPercentage: '', price: '', imageUrl: '', isAvailable: true
    });
    const [editingId, setEditingId] = useState(null);

    // Confirmation Modal State
    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchData = async () => {
        // Prevent fetching if not authenticated or loading
        if (loading || !user || !user.isAdmin) return;

        if (activeTab === 'orders') {
            const data = await getOrders();
            setOrders(data);
        } else {
            const data = await getLiquors({});
            setLiquors(data);
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchData();
            const interval = setInterval(fetchData, 3000); // Poll every 3s
            return () => clearInterval(interval);
        }
    }, [activeTab, user]); // Added user to dependency

    console.log("AdminPage Render:", { authLoading, user }); // DEBUG

    if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    // Show Login if not authenticated as admin
    if (!user || !user.isAdmin) {
        console.log("Redirecting to AdminLoginPage because user is:", user); // DEBUG
        return <AdminLoginPage />;
    }

    const handleOrderStatus = async (id, status) => {
        await updateOrderStatus(id, status);
        fetchData();
    };

    const handleDeleteLiquor = (id) => {
        setIdToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await deleteLiquor(idToDelete);
            fetchData();
            setShowConfirm(false);
            setIdToDelete(null);
        }
    };

    const handleEditLiquor = (liquor) => {
        setFormData(liquor);
        setEditingId(liquor._id);
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateLiquor(editingId, formData);
            } else {
                await createLiquor(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', brand: '', category: 'Whisky', alcoholPercentage: '', price: '', imageUrl: '', isAvailable: true });
            fetchData();
        } catch (error) {
            toast.error('Error saving liquor');
        }
    };

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-serif text-primary">Admin Dashboard</h1>
                    <button onClick={fetchData} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex items-center gap-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                        Refresh Data
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`text-lg font-medium pb-2 transition-colors ${activeTab === 'orders' ? 'text-white border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        Live Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`text-lg font-medium pb-2 transition-colors ${activeTab === 'inventory' ? 'text-white border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        Inventory Management
                    </button>
                </div>

                {/* Orders View */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass p-6 rounded-xl border-l-4 ${order.status === 'completed' ? 'border-l-green-500' : 'border-l-yellow-500'} flex justify-between items-center`}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-white">{order.liquor?.name}</h3>
                                        <span className="text-sm text-gray-400">({order.liquor?.category})</span>
                                    </div>
                                    <div className="text-gray-300">
                                        <p><span className="text-primary">User:</span> {order.user?.name} ({order.user?.mobileNumber})</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {order.status === 'pending' ? (
                                    <button
                                        onClick={() => handleOrderStatus(order._id, 'completed')}
                                        className="bg-green-500/20 text-green-400 p-3 rounded-full hover:bg-green-500/30 transition-colors"
                                        title="Mark Completed"
                                    >
                                        <FiCheck size={24} />
                                    </button>
                                ) : (
                                    <span className="text-green-500 font-bold uppercase tracking-wider text-sm">Completed</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Inventory View */}
                {activeTab === 'inventory' && (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', brand: '', category: 'Whisky', alcoholPercentage: '', price: '', imageUrl: '', isAvailable: true }); }}
                                className="bg-primary text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                            >
                                <FiPlus /> Add New Item
                            </button>
                        </div>

                        {/* Inventory Grid */}
                        <div className="grid gap-4">
                            {liquors.map((item) => (
                                <div key={item._id} className="glass p-4 rounded-xl flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-secondary" />
                                        <div>
                                            <h4 className="text-white font-bold">{item.name}</h4>
                                            <p className="text-sm text-gray-400">{item.category} | ₹{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditLiquor(item)} className="p-2 text-blue-400 hover:bg-white/5 rounded-lg"><FiEdit2 /></button>
                                        <button onClick={() => handleDeleteLiquor(item._id)} className="p-2 text-red-400 hover:bg-white/5 rounded-lg"><FiTrash2 /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-secondary p-8 rounded-2xl w-full max-w-lg border border-white/10"
                            >
                                <h2 className="text-2xl text-white font-serif mb-6">{editingId ? 'Edit Liquor' : 'Add New Liquor'}</h2>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <input required placeholder="Name" className="w-full bg-white/5 p-3 rounded-lg text-white border border-white/10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    <div className="flex gap-4">
                                        <input required placeholder="Brand" className="w-1/2 bg-white/5 p-3 rounded-lg text-white border border-white/10" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                                        <div className="relative w-1/2">
                                            <select
                                                required
                                                className="w-full bg-white/5 p-3 rounded-lg text-white border border-white/10 appearance-none focus:outline-none focus:border-primary/50 transition-colors"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {['Whisky', 'Vodka', 'Rum', 'Beer', 'Wine', 'Gin', 'Tequila'].map(c => <option key={c} value={c} className="bg-secondary text-white">{c}</option>)}
                                            </select>
                                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <input required type="number" placeholder="Price" className="w-1/2 bg-white/5 p-3 rounded-lg text-white border border-white/10" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                        <input required type="number" placeholder="Alcohol %" className="w-1/2 bg-white/5 p-3 rounded-lg text-white border border-white/10" value={formData.alcoholPercentage} onChange={(e) => setFormData({ ...formData, alcoholPercentage: e.target.value })} />
                                    </div>
                                    <input required placeholder="Image URL description" className="w-full bg-white/5 p-3 rounded-lg text-white border border-white/10" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />

                                    <div className="flex justify-end gap-2 mt-6">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                        <button type="submit" className="bg-primary text-black px-6 py-2 rounded-lg font-bold">Save</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => { setShowConfirm(false); setIdToDelete(null); }}
                    onConfirm={handleConfirmDelete}
                    title="Delete Item"
                    message="Are you sure you want to delete this liquor? This action cannot be undone."
                />
            </div>
        </PageTransition>
    );
};

export default AdminPage;
