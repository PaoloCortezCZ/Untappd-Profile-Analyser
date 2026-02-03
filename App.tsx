import React, { useState, useRef, useEffect } from 'react';
import { UntappdCheckin } from './types';
import StatCard from './components/StatCard';
import Analytics from './components/Analytics';
import BeerFeed from './components/BeerFeed';
import PhotoGallery from './components/PhotoGallery';
import { Beer, BarChart3, List, Grid, Upload, RotateCcw, Factory, Calendar, Star, Moon, Sun } from 'lucide-react';
import { parseDate, parseCSV } from './utils';

// Placeholder data from prompt - In a real scenario, this might be loaded differently,
// but for the "Load Sample" button, we embed it here.
const SAMPLE_DATA: UntappdCheckin[] = [
    {
    "beer_name": "Victoria Bitter (VB)",
    "brewery_name": "Carlton & United Breweries",
    "beer_type": "Lager - Pale",
    "beer_abv": 4.9,
    "beer_ibu": 25,
    "comment": "",
    "venue_name": "Untappd at Home",
    "venue_city": "",
    "venue_state": "NC",
    "venue_country": "United States",
    "venue_lat": 34.2347,
    "venue_lng": -77.9482,
    "rating_score": 3,
    "created_at": "2015-07-24 16:31:00",
    "checkin_url": "https://untappd.com/c/1246997378",
    "beer_url": "https://untappd.com/beer/5981",
    "brewery_url": "https://untappd.com/brewery/4045",
    "brewery_country": "Australia",
    "brewery_city": "Abbotsford",
    "brewery_state": "Victoria",
    "flavor_profiles": "light bodied,bitter,malty",
    "purchase_venue": "",
    "serving_type": "Bottle",
    "checkin_id": 1246997378,
    "bid": 5981,
    "brewery_id": 4045,
    "photo_url": "https://picsum.photos/400/400?random=1",
    "global_rating_score": 2.86,
    "global_weighted_rating_score": 2.87,
    "tagged_friends": "",
    "total_toasts": 0,
    "total_comments": 0
    },
    {
    "beer_name": "Carlton Draught",
    "brewery_name": "Carlton & United Breweries",
    "beer_type": "Lager - Pale",
    "beer_abv": 4.6,
    "beer_ibu": 22,
    "comment": "",
    "venue_name": "Untappd at Home",
    "venue_city": "",
    "venue_state": "NC",
    "venue_country": "United States",
    "venue_lat": 34.2347,
    "venue_lng": -77.9482,
    "rating_score": 2.75,
    "created_at": "2015-07-29 16:33:00",
    "checkin_url": "https://untappd.com/c/1246997876",
    "beer_url": "https://untappd.com/beer/5980",
    "brewery_url": "https://untappd.com/brewery/4045",
    "brewery_country": "Australia",
    "brewery_city": "Abbotsford",
    "brewery_state": "Victoria",
    "flavor_profiles": "light bodied,clean,dry,full bodied,sweet",
    "purchase_venue": "",
    "serving_type": "Bottle",
    "checkin_id": 1246997876,
    "bid": 5980,
    "brewery_id": 4045,
    "photo_url": "https://picsum.photos/400/400?random=2",
    "global_rating_score": 2.8,
    "global_weighted_rating_score": 2.81,
    "tagged_friends": "",
    "total_toasts": 0,
    "total_comments": 0
    },
    {
    "beer_name": "XXXX Gold",
    "brewery_name": "Castlemaine Perkins",
    "beer_type": "Lager - Other Light",
    "beer_abv": 3.5,
    "beer_ibu": 14,
    "comment": "",
    "venue_name": "Untappd at Home",
    "venue_city": "",
    "venue_state": "NC",
    "venue_country": "United States",
    "venue_lat": 34.2347,
    "venue_lng": -77.9482,
    "rating_score": 3.5,
    "created_at": "2015-08-01 16:34:00",
    "checkin_url": "https://untappd.com/c/1246998286",
    "beer_url": "https://untappd.com/beer/7438",
    "brewery_url": "https://untappd.com/brewery/1928",
    "brewery_country": "Australia",
    "brewery_city": "Milton",
    "brewery_state": "Queensland",
    "flavor_profiles": "light bodied,smooth",
    "purchase_venue": "",
    "serving_type": "Bottle",
    "checkin_id": 1246998286,
    "bid": 7438,
    "brewery_id": 1928,
    "photo_url": "https://picsum.photos/400/400?random=3",
    "global_rating_score": 2.69,
    "global_weighted_rating_score": 2.7,
    "tagged_friends": "",
    "total_toasts": 0,
    "total_comments": 0
    },
    {
    "beer_name": "New",
    "brewery_name": "Tooheys Brewing",
    "beer_type": "Lager - Pale",
    "beer_abv": 4.6,
    "beer_ibu": 17,
    "comment": "",
    "venue_name": "Untappd at Home",
    "venue_city": "",
    "venue_state": "NC",
    "venue_country": "United States",
    "venue_lat": 34.2347,
    "venue_lng": -77.9482,
    "rating_score": 3,
    "created_at": "2015-08-03 16:35:00",
    "checkin_url": "https://untappd.com/c/1246998598",
    "beer_url": "https://untappd.com/beer/5922",
    "brewery_url": "https://untappd.com/brewery/13905",
    "brewery_country": "Australia",
    "brewery_city": "Lidcombe",
    "brewery_state": "New South Wales",
    "flavor_profiles": "light bodied,smooth,malty,dry,sweet",
    "purchase_venue": "",
    "serving_type": "Can",
    "checkin_id": 1246998598,
    "bid": 5922,
    "brewery_id": 13905,
    "photo_url": "https://picsum.photos/400/400?random=4",
    "global_rating_score": 2.85,
    "global_weighted_rating_score": 2.86,
    "tagged_friends": "",
    "total_toasts": 0,
    "total_comments": 0
    },
    {
    "beer_name": "Pure Blond",
    "brewery_name": "Monteith's Brewing Co.",
    "beer_type": "Lager - Pale",
    "beer_abv": 4.6,
    "beer_ibu": 0,
    "comment": "",
    "venue_name": "Untappd at Home",
    "venue_city": "",
    "venue_state": "NC",
    "venue_country": "United States",
    "venue_lat": 34.2347,
    "venue_lng": -77.9482,
    "rating_score": 3.25,
    "created_at": "2015-08-11 16:36:00",
    "checkin_url": "https://untappd.com/c/1246999027",
    "beer_url": "https://untappd.com/beer/755181",
    "brewery_url": "https://untappd.com/brewery/881",
    "brewery_country": "New Zealand",
    "brewery_city": "Greymouth",
    "brewery_state": "West Coast",
    "flavor_profiles": "light bodied,malty",
    "purchase_venue": "",
    "serving_type": "Can",
    "checkin_id": 1246999027,
    "bid": 755181,
    "brewery_id": 881,
    "photo_url": "https://picsum.photos/400/400?random=5",
    "global_rating_score": 3.23,
    "global_weighted_rating_score": 3.68,
    "tagged_friends": "",
    "total_toasts": 0,
    "total_comments": 0
    },
    {
        "beer_name": "IPA 15",
        "brewery_name": "Rodinný pivovar u Vacků",
        "beer_type": "IPA - American",
        "beer_abv": 6,
        "beer_ibu": 0,
        "comment": "",
        "venue_name": "Untappd at Home",
        "venue_city": "",
        "venue_state": "NC",
        "venue_country": "United States",
        "venue_lat": 34.2347,
        "venue_lng": -77.9482,
        "rating_score": 3.5,
        "created_at": "2024-01-08 23:18:40",
        "checkin_url": "https://untappd.com/c/1347505810",
        "beer_url": "https://untappd.com/beer/875301",
        "brewery_url": "https://untappd.com/brewery/167992",
        "brewery_country": "Czech Republic",
        "brewery_city": "52",
        "brewery_state": "Královéhradecký kraj",
        "flavor_profiles": "hoppy",
        "purchase_venue": "",
        "serving_type": "Bottle",
        "checkin_id": 1347505810,
        "bid": 875301,
        "brewery_id": 167992,
        "photo_url": "https://picsum.photos/400/400?random=6",
        "global_rating_score": 3.73,
        "global_weighted_rating_score": 3.73,
        "tagged_friends": "",
        "total_toasts": 0,
        "total_comments": 0
    }
];

type View = 'dashboard' | 'feed' | 'gallery';

function App() {
  const [data, setData] = useState<UntappdCheckin[] | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [dragActive, setDragActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      
      // Basic check for file type based on extension or content structure
      if (file.name.toLowerCase().endsWith('.csv')) {
        try {
           const parsedData = await parseCSV(text);
           if (parsedData && parsedData.length > 0) {
             setData(parsedData);
           } else {
             alert("Could not parse CSV data. Please check the file format.");
           }
        } catch (error) {
           console.error(error);
           alert("Error parsing CSV file.");
        }
      } else {
        // Assume JSON
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            setData(json);
          } else {
            alert("Invalid JSON format. Expected an array.");
          }
        } catch (error) {
          alert("Error parsing file. Please upload a valid JSON or CSV file.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const loadSampleData = () => {
    setData(SAMPLE_DATA);
  };

  const resetData = () => {
    setData(null);
    setCurrentView('dashboard');
  };

  // Derived Stats
  const totalCheckins = data ? data.length : 0;
  const uniqueBeers = data ? new Set(data.map(i => i.bid)).size : 0;
  const uniqueBreweries = data ? new Set(data.map(i => i.brewery_id)).size : 0;
  const averageRating = data && data.length > 0
    ? (data.reduce((acc, curr) => acc + curr.rating_score, 0) / data.length).toFixed(2)
    : "0.00";

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300">
        
        {/* Absolute positioned theme toggle for the landing page */}
        <div className="absolute top-4 right-4">
             <button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
        </div>

        <div className="max-w-xl w-full text-center space-y-8">
          <div className="flex flex-col items-center">
            <div className="bg-amber-500 p-4 rounded-full mb-4 shadow-lg shadow-amber-500/20">
               <Beer size={48} className="text-slate-900" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Untappd Explorer</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visualize and analyze your beer journey.</p>
          </div>

          <div 
            className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center ${
              dragActive 
                ? "border-amber-500 bg-slate-100 dark:bg-slate-800/80" 
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} className={`mb-4 ${dragActive ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`} />
            <p className="text-xl font-medium text-slate-700 dark:text-slate-200">Upload your data file</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Supports .json or .csv formats</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json,.csv" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 dark:bg-slate-900 text-slate-500">Or</span>
            </div>
          </div>

          <button 
            onClick={loadSampleData}
            className="w-full py-3 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            Load Sample Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 lg:w-64 bg-white dark:bg-slate-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-row md:flex-col justify-between flex-shrink-0 z-20 sticky top-0 md:h-screen transition-colors duration-300">
        <div className="p-4 md:p-6 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg shrink-0">
             <Beer size={20} className="text-slate-900" />
          </div>
          <span className="font-bold text-lg hidden lg:block text-slate-900 dark:text-slate-100">Explorer</span>
        </div>

        <div className="flex flex-row md:flex-col w-full md:px-2 gap-1 overflow-x-auto md:overflow-visible">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center p-3 md:p-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <Grid size={24} className="lg:mr-3 shrink-0" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => setCurrentView('feed')}
            className={`flex items-center p-3 md:p-3 rounded-lg transition-colors ${currentView === 'feed' ? 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <List size={24} className="lg:mr-3 shrink-0" />
            <span className="hidden lg:block font-medium">Beers</span>
          </button>

          <button 
             onClick={() => setCurrentView('gallery')}
             className={`flex items-center p-3 md:p-3 rounded-lg transition-colors ${currentView === 'gallery' ? 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
             <div className="relative">
                <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-current rounded-[1px] opacity-80"></div>
                    <div className="bg-current rounded-[1px] opacity-60"></div>
                    <div className="bg-current rounded-[1px] opacity-60"></div>
                    <div className="bg-current rounded-[1px] opacity-80"></div>
                </div>
             </div>
             <span className="hidden lg:block font-medium ml-3">Photos</span>
          </button>
        </div>

        <div className="hidden md:flex flex-col gap-2 p-4">
           <button
            onClick={toggleTheme}
            className="flex items-center w-full p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
           >
            {isDarkMode ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
            <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
           </button>

           <button 
            onClick={resetData}
            className="flex items-center w-full p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
           >
            <RotateCcw size={20} className="mr-3" />
            <span className="hidden lg:block font-medium">Reset Data</span>
           </button>
        </div>
        
        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center pr-4 gap-2">
             <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-400 p-2">
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={resetData} className="text-slate-600 dark:text-slate-400 p-2">
                 <RotateCcw size={20} />
             </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
            {currentView === 'feed' ? 'Beer List' : currentView}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
             Analyzing {data.length} total check-ins
          </p>
        </header>

        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Check-ins" value={totalCheckins} icon={Beer} />
                <StatCard title="Unique Beers" value={uniqueBeers} icon={List} color="text-emerald-500" />
                <StatCard title="Unique Breweries" value={uniqueBreweries} icon={Factory} color="text-blue-500" />
                <StatCard title="Avg Rating" value={averageRating} icon={Star} color="text-yellow-500" />
             </div>
             
             {/* Integrated Analytics with Grid Support for Wide Screens */}
             <Analytics data={data} isDarkMode={isDarkMode} />
          </div>
        )}
        
        {currentView === 'feed' && <BeerFeed data={data} />}

        {currentView === 'gallery' && <PhotoGallery data={data} />}

      </main>
    </div>
  );
}

export default App;