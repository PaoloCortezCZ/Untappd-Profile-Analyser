import React, { useState, useMemo, useEffect } from 'react';
import { UntappdCheckin, SortField, SortOrder } from '../types';
import { Search, Star, Calendar, MapPin, Beer, ArrowUpAZ, ArrowDownAZ, ArrowUpDown, SlidersHorizontal, Hexagon } from 'lucide-react';
import { parseDate, getTasteProfile } from '../utils';
import TasteProfileChart from './TasteProfileChart';

interface BeerFeedProps {
  data: UntappdCheckin[];
}

const BeerFeed: React.FC<BeerFeedProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Detect dark mode for chart
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);


  // Filter data first
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.beer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brewery_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.beer_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Then sort
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'created_at':
          comparison = parseDate(a.created_at).getTime() - parseDate(b.created_at).getTime();
          break;
        case 'rating_score':
          comparison = a.rating_score - b.rating_score;
          break;
        case 'beer_abv':
          comparison = a.beer_abv - b.beer_abv;
          break;
        case 'beer_ibu':
          comparison = a.beer_ibu - b.beer_ibu;
          break;
        case 'beer_name':
          comparison = a.beer_name.localeCompare(b.beer_name);
          break;
        case 'beer_type':
          comparison = a.beer_type.localeCompare(b.beer_type);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateStr: string) => {
    return parseDate(dateStr).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
        
        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search beers, breweries, or styles..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors duration-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
             </div>
             <select 
               value={sortField}
               onChange={(e) => setSortField(e.target.value as SortField)}
               className="block w-full md:w-48 pl-10 pr-8 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm appearance-none cursor-pointer transition-colors duration-300"
             >
               <option value="created_at">Date Added</option>
               <option value="rating_score">Rating</option>
               <option value="beer_name">Name</option>
               <option value="beer_type">Style</option>
               <option value="beer_abv">ABV</option>
               <option value="beer_ibu">IBU</option>
             </select>
          </div>
          
          <button 
            onClick={toggleSortOrder}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors duration-300"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <ArrowUpAZ size={20} /> : <ArrowDownAZ size={20} />}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {currentData.map((checkin) => {
          // Calculate single beer taste profile
          const beerProfile = getTasteProfile([checkin]);
          
          return (
          <div key={checkin.checkin_id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-amber-500/50 transition-colors flex flex-col sm:flex-row gap-4 group duration-300 overflow-hidden">
            
            {/* Beer Thumb / Icon */}
            <div className="flex-shrink-0">
               {checkin.photo_url ? (
                 <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <img src={checkin.photo_url} alt={checkin.beer_name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                 </div>
               ) : (
                 <div className="h-24 w-24 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600">
                   <Beer size={32} />
                 </div>
               )}
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                    <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate pr-2">{checkin.beer_name}</h4>
                    <p className="text-amber-600 dark:text-amber-500 font-medium text-sm">{checkin.brewery_name}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-amber-500 dark:text-amber-400 font-bold border border-slate-200 dark:border-slate-700">
                        <Star size={14} className="mr-1 fill-current" />
                        {checkin.rating_score}
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center"><Beer size={14} className="mr-1" /> {checkin.beer_type}</span>
                    <span className="flex items-center bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded text-xs">ABV: {checkin.beer_abv}%</span>
                    {checkin.beer_ibu > 0 && <span className="flex items-center bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded text-xs">IBU: {checkin.beer_ibu}</span>}
                </div>
              </div>
              
              <div className="mt-3">
                 <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {formatDate(checkin.created_at)}</span>
                    {checkin.venue_name && (
                        <span className="flex items-center truncate max-w-[150px] sm:max-w-xs"><MapPin size={14} className="mr-1" /> {checkin.venue_name}</span>
                    )}
                    </div>
                    <a href={checkin.checkin_url} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:underline">View on Untappd</a>
                </div>
                {checkin.comment && (
                    <div className="mt-2 bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 italic border-l-2 border-slate-300 dark:border-slate-600">
                    "{checkin.comment}"
                    </div>
                )}
              </div>
            </div>

            {/* Radar Chart for Wide Screens */}
            <div className="hidden xl:block w-48 flex-shrink-0 border-l border-slate-200 dark:border-slate-700 pl-4">
                <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center text-xs text-slate-400 mb-1">
                        <Hexagon size={10} className="mr-1" />
                        <span className="uppercase tracking-wider">Taste Profile</span>
                    </div>
                    <div className="h-32">
                        <TasteProfileChart data={beerProfile} isDarkMode={isDarkMode} height={128} compact />
                    </div>
                </div>
            </div>

          </div>
        )}})}

        {currentData.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                No beers found matching your criteria.
            </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-8">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Prev
            </button>
            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
};

export default BeerFeed;