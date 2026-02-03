import { UntappdCheckin, ChartData, TimelineData, TasteData } from './types';
import Papa from 'papaparse';

export const parseDate = (dateStr: string): Date => {
  // Format: "2015-07-24 16:31:00"
  return new Date(dateStr.replace(' ', 'T'));
};

export const parseCSV = (csvText: string): Promise<UntappdCheckin[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: UntappdCheckin[] = results.data.map((row: any) => ({
            beer_name: row.beer_name || "",
            brewery_name: row.brewery_name || "",
            beer_type: row.beer_type || "",
            beer_abv: parseFloat(row.beer_abv) || 0,
            beer_ibu: parseInt(row.beer_ibu) || 0,
            comment: row.comment || "",
            venue_name: row.venue_name || null,
            venue_city: row.venue_city || null,
            venue_state: row.venue_state || null,
            venue_country: row.venue_country || null,
            venue_lat: row.venue_lat ? parseFloat(row.venue_lat) : null,
            venue_lng: row.venue_lng ? parseFloat(row.venue_lng) : null,
            rating_score: parseFloat(row.rating_score) || 0,
            created_at: row.created_at || "",
            checkin_url: row.checkin_url || "",
            beer_url: row.beer_url || "",
            brewery_url: row.brewery_url || "",
            brewery_country: row.brewery_country || "",
            brewery_city: row.brewery_city || "",
            brewery_state: row.brewery_state || "",
            flavor_profiles: row.flavor_profiles || "",
            purchase_venue: row.purchase_venue || "",
            serving_type: row.serving_type || "",
            checkin_id: parseInt(row.checkin_id) || 0,
            bid: parseInt(row.bid) || 0,
            brewery_id: parseInt(row.brewery_id) || 0,
            photo_url: row.photo_url || null,
            global_rating_score: parseFloat(row.global_rating_score) || 0,
            global_weighted_rating_score: parseFloat(row.global_weighted_rating_score) || 0,
            tagged_friends: row.tagged_friends || "",
            total_toasts: parseInt(row.total_toasts) || 0,
            total_comments: parseInt(row.total_comments) || 0,
          }));
          resolve(data);
        } catch (e) {
          reject(e);
        }
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
};

export const getTopStyles = (data: UntappdCheckin[]): ChartData[] => {
  const styles: Record<string, number> = {};
  data.forEach(item => {
    const style = item.beer_type;
    styles[style] = (styles[style] || 0) + 1;
  });

  return Object.entries(styles)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

export const getTopBreweries = (data: UntappdCheckin[]): ChartData[] => {
  const breweries: Record<string, number> = {};
  data.forEach(item => {
    const brewery = item.brewery_name;
    breweries[brewery] = (breweries[brewery] || 0) + 1;
  });

  return Object.entries(breweries)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

export const getRatingDistribution = (data: UntappdCheckin[]): ChartData[] => {
  const ratings: Record<string, number> = {};
  data.forEach(item => {
    const score = item.rating_score.toString();
    ratings[score] = (ratings[score] || 0) + 1;
  });

  const result: ChartData[] = [];
  for (let i = 0; i <= 5; i += 0.25) {
    const key = i.toString();
    result.push({ name: key, value: ratings[key] || 0 });
  }
  return result;
};

export const getTimelineData = (data: UntappdCheckin[]): TimelineData[] => {
  const timeline: Record<string, { count: number; sumRating: number; checkins: UntappdCheckin[] }> = {};
  
  const sortedData = [...data].sort((a, b) => 
    parseDate(a.created_at).getTime() - parseDate(b.created_at).getTime()
  );

  sortedData.forEach(item => {
    const date = parseDate(item.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!timeline[key]) {
      timeline[key] = { count: 0, sumRating: 0, checkins: [] };
    }
    timeline[key].count += 1;
    timeline[key].sumRating += item.rating_score;
    timeline[key].checkins.push(item);
  });

  return Object.entries(timeline).map(([date, stats]) => ({
    date,
    count: stats.count,
    avgRating: stats.count > 0 ? parseFloat((stats.sumRating / stats.count).toFixed(2)) : 0,
    checkins: stats.checkins.reverse()
  }));
};

export const getTopFlavors = (data: UntappdCheckin[]): ChartData[] => {
  const flavors: Record<string, number> = {};
  data.forEach(item => {
    if (item.flavor_profiles) {
      const tags = item.flavor_profiles.split(',').map(s => s.trim());
      tags.forEach(tag => {
        if (tag) flavors[tag] = (flavors[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(flavors)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
};

export const getTasteProfile = (data: UntappdCheckin[]): TasteData[] => {
  // 6 Axis Hexagon
  const categories: Record<string, string[]> = {
    'Hoppy': ['hoppy', 'pine', 'resin', 'grass', 'herbal', 'floral', 'ipa', 'pale ale', 'dipa', 'neipa'],
    'Malty': ['malty', 'bread', 'grain', 'biscuit', 'toast', 'cereal', 'caramel', 'toffee', 'amber', 'bock', 'brown ale'],
    'Dark/Roast': ['roast', 'coffee', 'chocolate', 'cocoa', 'burnt', 'smoke', 'smoky', 'stout', 'porter', 'dark'],
    'Sweet': ['sweet', 'sugar', 'honey', 'vanilla', 'lactose', 'candy', 'marshmallow', 'pastry', 'milkshake'],
    'Sour': ['sour', 'tart', 'funky', 'acidic', 'wild', 'vinegar', 'lambic', 'gose', 'berliner'],
    'Fruity': ['fruit', 'citrus', 'berry', 'tropical', 'banana', 'mango', 'peach', 'orange', 'lemon', 'lime', 'grape', 'cherry']
  };

  const scores: Record<string, number> = {
    'Hoppy': 0,
    'Malty': 0,
    'Dark/Roast': 0,
    'Sweet': 0,
    'Sour': 0,
    'Fruity': 0
  };

  let totalMatches = 0;

  data.forEach(item => {
    // Combine flavor tags and beer type for analysis
    const text = `${item.flavor_profiles} ${item.beer_type}`.toLowerCase();
    
    Object.entries(categories).forEach(([category, keywords]) => {
      // Check if any keyword exists in the text
      const matches = keywords.some(keyword => text.includes(keyword));
      if (matches) {
        scores[category] += 1;
        totalMatches += 1;
      }
    });
  });
  
  // Normalize to 100 for the chart
  // If no data, return balanced
  if (totalMatches === 0 && data.length > 0) return Object.keys(categories).map(k => ({ subject: k, A: 0, fullMark: 100 }));
  
  // To make the chart look fuller for small datasets (like single beer), we might scale differently
  // But for aggregates, % share is good.
  // Let's use relative frequency scaled up. 
  
  const maxScore = Math.max(...Object.values(scores));
  
  return Object.keys(categories).map(key => ({
    subject: key,
    // Scale relative to max, so the highest category touches the edge (100) or at least 80%
    A: maxScore > 0 ? Math.round((scores[key] / maxScore) * 100) : 0,
    fullMark: 100
  }));
};

export const formatCurrency = (val: number) => new Intl.NumberFormat().format(val);