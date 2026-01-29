import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import LiquorCard from '../components/UI/LiquorCard';
import PageTransition from '../components/UI/PageTransition';
import { getLiquors } from '../services/liquorService';

const CATEGORIES = ['All', 'Whisky', 'Vodka', 'Rum', 'Beer', 'Wine', 'Gin', 'Tequila'];

const HomePage = () => {
    const [liquors, setLiquors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchLiquors();
    }, [search, category, priceRange]);

    const fetchLiquors = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (category !== 'All') params.category = category;
            if (priceRange.min) params.minPrice = priceRange.min;
            if (priceRange.max) params.maxPrice = priceRange.max;

            const data = await getLiquors(params);
            setLiquors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="relative min-h-screen pb-20">
                {/* Hero / Search Section */}
                <div className="sticky top-20 z-40 bg-dark/80 backdrop-blur-xl border-b border-white/10 py-6 mb-8 -mx-4 px-4 shadow-2xl">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search Bar */}
                            <div className="relative flex-grow w-full">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search for your favorite drink..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-gray-600 shadow-inner"
                                />
                            </div>

                            {/* Filter Toggle (Mobile) */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full py-3 text-sm font-medium text-gray-300 active:bg-white/10"
                            >
                                <FiFilter /> Filters
                            </button>

                            {/* Desktop Price Filters */}
                            <div className="hidden md:flex gap-2 items-center bg-white/5 p-1 rounded-full border border-white/10">
                                <input
                                    type="number"
                                    placeholder="Min ₹"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-24 bg-transparent border-none py-2 px-3 text-white text-sm focus:ring-0 placeholder:text-gray-600 text-center"
                                />
                                <span className="text-gray-600">-</span>
                                <input
                                    type="number"
                                    placeholder="Max ₹"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-24 bg-transparent border-none py-2 px-3 text-white text-sm focus:ring-0 placeholder:text-gray-600 text-center"
                                />
                            </div>
                        </div>

                        {/* Mobile Filters Expand */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="md:hidden overflow-hidden"
                                >
                                    <div className="flex gap-2 pt-2">
                                        <input
                                            type="number"
                                            placeholder="Min Price"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-1/2 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Price"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-1/2 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mask-fade-sides">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm whitespace-nowrap border transition-all duration-300 font-medium tracking-wide ${category === cat
                                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-gray-500 animate-pulse">Curating the finest selection...</p>
                        </div>
                    ) : liquors.length > 0 ? (
                        <>
                            <p className="text-gray-500 mb-6 text-sm">Showing {liquors.length} premium selections</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                {liquors.map((liquor) => (
                                    <LiquorCard key={liquor._id} liquor={liquor} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-white/5 p-6 rounded-full mb-4">
                                <FiSearch size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">No matches found</h3>
                            <p className="text-gray-500 max-w-xs">We couldn't find any liquor matching your criteria. Try adjusting your filters.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); setPriceRange({ min: '', max: '' }); }}
                                className="mt-6 text-primary hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default HomePage;
