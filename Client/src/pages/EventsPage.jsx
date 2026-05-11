import { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, X, Filter, SlidersHorizontal, MapPin, Calendar, Tag, Sparkles, Zap, ArrowRight, IndianRupee, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/EventCard';
import { useInfiniteEvents } from '../hooks/queries/useEvents';
import LoadingScreen from '../components/LoadingScreen';
import { CATEGORIES } from '../constants/categories';
import PageTransition from '../components/animations/PageTransition';

const SkeletonCard = () => (
  <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] overflow-hidden animate-pulse">
    <div className="h-64 bg-white/5"></div>
    <div className="p-8 space-y-6">
      <div className="h-8 bg-white/5 rounded-xl w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
        <div className="h-4 bg-white/5 rounded-lg w-1/3"></div>
      </div>
      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <div className="h-6 bg-white/5 rounded-lg w-24"></div>
        <div className="h-10 bg-white/5 rounded-xl w-32"></div>
      </div>
    </div>
  </div>
);

export default function EventsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    date: "All Time",
    minPrice: "",
    maxPrice: "",
    sort: "Newest First"
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef(null);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError 
  } = useInfiniteEvents({ 
    ...filters, 
    search: debouncedSearch 
  });

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten events from all pages
  const rawEvents = data?.pages.flatMap(page => page.events) || [];
  const events = Array.from(new Map(rawEvents.map(event => [event._id, event])).values());
  const totalEventsCount = data?.pages[0]?.totalEvents || 0;
  
  const [viewMode, setViewMode] = useState('grid');

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      date: "All Time",
      minPrice: "",
      maxPrice: "",
      sort: "Newest First"
    });
  };

  if (isLoading && !data) return <LoadingScreen />;

  if (isError) {
    return (
      <PageTransition>
        <div className="bg-[#050508] min-h-screen text-white flex items-center justify-center p-6 font-outfit">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-500/5 border border-rose-500/10 rounded-[3rem] p-16 text-center max-w-md shadow-2xl"
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
             <X className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="font-bebas text-5xl text-white tracking-widest mb-4">SOMETHING WENT WRONG</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">We couldn't load events right now. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-2xl">
            Retry
          </button>
        </motion.div>
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen text-white font-outfit selection:bg-violet-500/30">
      <section className="relative pt-24 md:pt-44 pb-8 md:pb-24 px-6 overflow-hidden">
        {/* Ambient Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] bg-violet-600/5 blur-[120px] md:blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 backdrop-blur-md">
                 <Sparkles className="w-3 h-3 text-violet-400" />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Explore Events</span>
              </div>
              <h1 className="font-bebas text-4xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-white leading-[0.8] tracking-tighter mb-4 md:mb-8">
                EXPLORE <br /> <span className="text-violet-500">ALL EVENTS.</span>
              </h1>
              <p className="text-gray-500 text-sm md:text-xl max-w-xl leading-relaxed font-medium">
                Browse and discover events from top organizers near you.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 md:gap-6"
            >
              <div className="glass-panel px-4 py-3 md:px-10 md:py-6 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center gap-1 group">
                 <span className="text-violet-500 font-bebas text-2xl md:text-5xl group-hover:scale-110 transition-transform">{totalEventsCount}</span>
                 <span className="text-gray-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Active Events</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-12 md:pb-40 relative z-10">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex items-center gap-4">
           <button 
             onClick={() => setIsFilterOpen(true)}
             className="flex-1 flex items-center justify-between bg-[#12121A] border border-white/5 rounded-2xl px-6 py-4"
           >
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-3">
               <SlidersHorizontal className="w-4 h-4 text-violet-500" /> Advanced Filters
             </span>
             <ChevronRight className="w-4 h-4 text-gray-700" />
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
          
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 1024) && (
              <motion.aside 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`fixed inset-0 z-[100] lg:relative lg:z-10 lg:block w-full lg:w-80 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
              >
                {/* Mobile Backdrop */}
                <div className="lg:hidden absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                
                <div className="relative h-full lg:h-auto lg:sticky lg:top-32 space-y-6 md:space-y-8 bg-[#050508] lg:bg-transparent pt-24 px-6 pb-6 lg:p-0 overflow-y-auto lg:overflow-visible">
                  {/* Mobile Header */}
                  <div className="lg:hidden flex items-center justify-between mb-8">
                     <h3 className="text-white font-bebas text-3xl tracking-widest">FILTERS</h3>
                     <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                     </button>
                  </div>

                  {/* Search Terminal */}
                  <div className="bg-[#12121A] border border-white/5 rounded-2xl md:rounded-3xl p-2 focus-within:border-violet-500/50 transition-all group shadow-2xl">
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 w-4 h-4 md:w-5 md:h-5 text-gray-700 group-focus-within:text-violet-400 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search events..." 
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full bg-transparent border-none outline-none py-2 md:py-4 pl-10 md:pl-14 pr-4 text-white placeholder-gray-800 font-bold text-sm tracking-tight"
                      />
                    </div>
                  </div>

                  <div className="bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-8 md:space-y-12 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <h3 className="text-white font-bebas text-2xl md:text-3xl tracking-widest flex items-center gap-3">
                          <Filter className="w-4 h-4 md:w-5 md:h-5 text-violet-500" /> PREFERENCES
                       </h3>
                        <button 
                          onClick={resetFilters}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-violet-400 transition-colors"
                        >
                          Reset
                        </button>
                    </div>

                    <div className="space-y-10">
                      {/* Category Filter */}
                      <div>
                        <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Category</p>
                        <div className="space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {CATEGORIES.map((cat) => (
                            <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="category" 
                                className="hidden" 
                                checked={filters.category === cat}
                                onChange={() => handleFilterChange('category', cat)}
                              />
                              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border flex items-center justify-center transition-all 
                                ${filters.category === cat ? 'border-violet-500 bg-violet-500/20' : 'border-white/5 bg-white/[0.02] group-hover:border-violet-500'}`}>
                                <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-violet-500 transition-opacity ${filters.category === cat ? 'opacity-100' : 'opacity-0'}`}></div>
                              </div>
                              <span className={`text-sm font-bold transition-colors ${filters.category === cat ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Price Range</p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-800 uppercase tracking-widest ml-1">Min (₹)</label>
                              <input 
                                type="number" 
                                placeholder="0" 
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 md:py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 font-bold" 
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-800 uppercase tracking-widest ml-1">Max (₹)</label>
                              <input 
                                type="number" 
                                placeholder="9999" 
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 md:py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 font-bold" 
                              />
                           </div>
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div>
                        <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Date</p>
                        <select 
                          value={filters.date}
                          onChange={(e) => handleFilterChange('date', e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 md:py-4 text-sm text-gray-500 outline-none focus:border-violet-500/50 appearance-none font-bold"
                        >
                          <option className="bg-[#12121A]" value="All Time">All Time</option>
                          <option className="bg-[#12121A]" value="Today">Today</option>
                          <option className="bg-[#12121A]" value="Next 30 Days">Next 30 Days</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={() => { resetFilters(); setIsFilterOpen(false); }}
                      className="w-full py-4 md:py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-violet-600 hover:text-white transition-all duration-500 shadow-xl shadow-white/5"
                    >
                      Apply Protocols
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Discovery Stream */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8 mb-6 md:mb-12">
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-700 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-700 hover:text-white'}`}
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">Sort By:</span>
                <select 
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-transparent text-white font-black text-xs uppercase tracking-widest outline-none cursor-pointer border-b-2 border-violet-500 pb-2"
                >
                  <option className="bg-[#050508]" value="Newest First">Newest First</option>
                  <option className="bg-[#050508]" value="Price: Low → High">Price: Low → High</option>
                  <option className="bg-[#050508]" value="Price: High → Low">Price: High → Low</option>
                </select>
              </div>
            </div>

            <div className={`grid gap-4 md:gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              <AnimatePresence mode="popLayout">
                {events.length > 0 ? (
                  events.map((event, idx) => (
                    <motion.div 
                      key={event._id} 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 9) * 0.05 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))
                ) : !isLoading && (
                  <div className="col-span-full py-12 md:py-40 text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto mb-8">
                      <Zap className="w-8 h-8 md:w-12 md:h-12 text-gray-800" />
                    </div>
                    <h3 className="font-bebas text-4xl md:text-6xl text-white tracking-widest mb-4">No Events Found</h3>
                    <p className="text-gray-600 font-medium">No events match the current search parameters.</p>
                  </div>
                )}
                
                {(isLoading || isFetchingNextPage) && (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Infinite Scroll & Load More Trigger */}
            <div ref={loadMoreRef} className="mt-12 md:mt-24 pt-6 md:pt-10 text-center space-y-8">
              {hasNextPage ? (
                <div className="flex flex-col items-center gap-6">
                   <button 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-violet-600 hover:border-violet-500 transition-all group disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting...</span>
                      </div>
                    ) : (
                      "Load More Experiences"
                    )}
                  </button>
                  <p className="text-gray-700 text-[9px] font-black uppercase tracking-widest">Scrolling down activates automatic protocol</p>
                </div>
              ) : events.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 border-t border-white/5"
                >
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-6 h-6 text-gray-800" />
                   </div>
                   <h3 className="font-bebas text-4xl text-gray-500 tracking-widest uppercase">You've explored all protocols</h3>
                   <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Check back later for new experiences</p>
                </motion.div>
              ) : null}

              {/* Error fallback for subsequent pages */}
              {isError && events.length > 0 && (
                <div className="py-10 bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8 max-w-sm mx-auto">
                   <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">Transmission Interrupted</p>
                   <button 
                    onClick={() => fetchNextPage()}
                    className="text-white text-[10px] font-black uppercase tracking-widest underline decoration-rose-500 underline-offset-4"
                  >
                    Retry Connection
                   </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
