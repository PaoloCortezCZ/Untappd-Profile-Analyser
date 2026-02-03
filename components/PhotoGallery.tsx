import React from 'react';
import { UntappdCheckin } from '../types';
import { Star } from 'lucide-react';

interface PhotoGalleryProps {
  data: UntappdCheckin[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ data }) => {
  const dataWithPhotos = data.filter(item => item.photo_url && item.photo_url.length > 0);

  return (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Check-in Gallery ({dataWithPhotos.length})</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dataWithPhotos.map((checkin) => (
                <a 
                    key={checkin.checkin_id} 
                    href={checkin.checkin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative block aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-colors duration-300"
                >
                    <img 
                        src={checkin.photo_url!} 
                        alt={checkin.beer_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white font-bold text-sm truncate">{checkin.beer_name}</p>
                        <p className="text-amber-400 text-xs truncate">{checkin.brewery_name}</p>
                        <div className="flex items-center text-white text-xs mt-1">
                             <Star size={10} className="fill-current text-amber-500 mr-1" />
                             {checkin.rating_score}
                        </div>
                    </div>
                </a>
            ))}
        </div>
        
        {dataWithPhotos.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 border-dashed">
                <p className="text-slate-500 dark:text-slate-400">No photos found in this dataset.</p>
            </div>
        )}
    </div>
  );
};

export default PhotoGallery;