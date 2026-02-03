import React from 'react';
import { UntappdCheckin } from '../types';
import { X, Star, Beer } from 'lucide-react';
import { parseDate } from '../utils';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  checkins: UntappdCheckin[];
}

const CheckinModal: React.FC<CheckinModalProps> = ({ isOpen, onClose, title, checkins }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check-ins list</p>
            </div>
            <button 
                onClick={onClose} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <X size={24} />
            </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {checkins.map((checkin) => (
                <div key={checkin.checkin_id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-amber-500/30 transition-colors">
                     <div className="flex-shrink-0 mt-1">
                        {checkin.photo_url ? (
                            <img src={checkin.photo_url} alt={checkin.beer_name} className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700" loading="lazy" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                <Beer size={16} />
                            </div>
                        )}
                     </div>
                     <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{checkin.beer_name}</h4>
                            <div className="flex items-center bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-500 text-xs font-bold whitespace-nowrap ml-2">
                                <Star size={10} className="fill-current mr-1" />
                                {checkin.rating_score}
                            </div>
                        </div>
                        <p className="text-xs text-amber-600/80 dark:text-amber-500/80 truncate mb-1">{checkin.brewery_name}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-transparent">{checkin.beer_type}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-600">{parseDate(checkin.created_at).toLocaleDateString()}</span>
                        </div>
                     </div>
                </div>
            ))}
            {checkins.length === 0 && (
                <p className="text-center text-slate-500 py-8">No check-ins found for this period.</p>
            )}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-xl text-center text-xs text-slate-500">
             Showing {checkins.length} beers
        </div>
      </div>
    </div>
  );
};

export default CheckinModal;