import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-secondary p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-red-500/20 p-3 rounded-full text-red-500">
                                <FiAlertTriangle size={24} />
                            </div>
                            <h2 className="text-2xl text-white font-serif">{title || 'Confirm Action'}</h2>
                        </div>

                        <p className="text-gray-300 mb-8 leading-relaxed">
                            {message || 'Are you sure you want to proceed with this action? This cannot be undone.'}
                        </p>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-400 hover:text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
