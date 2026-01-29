import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LiquorCard = ({ liquor }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
        >
            <Link to={`/liquors/${liquor._id}`} className="block h-full flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    {liquor.imageUrl ? (
                        <img
                            src={liquor.imageUrl}
                            alt={liquor.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-secondary-800">No Image</div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-80" />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {!liquor.isAvailable && (
                            <span className="bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md">
                                Out of Stock
                            </span>
                        )}
                        <span className="bg-black/50 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md border border-white/10">
                            {liquor.category}
                        </span>
                    </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent">
                    <div className="mb-4">
                        <p className="text-primary text-xs font-medium uppercase tracking-widest mb-1 opacity-80">{liquor.brand}</p>
                        <h3 className="font-serif text-xl text-white leading-tight group-hover:text-primary transition-colors duration-300">{liquor.name}</h3>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Per Bottle</span>
                            <span className="text-2xl font-serif text-primary font-bold">₹{liquor.price}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                            {liquor.alcoholPercentage}% Abv
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default LiquorCard;
