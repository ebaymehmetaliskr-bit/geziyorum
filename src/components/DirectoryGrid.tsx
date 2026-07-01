"use client";

import { useMemo, useState } from 'react';
import { TourListing } from '../types';
import { ListingCard } from './ListingCard';
import { useSearchParams, useRouter } from 'next/navigation';

interface DirectoryGridProps {
  listings: TourListing[];
  onSelectListing: (listing: TourListing) => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group animate-pulse">
      <div className="aspect-[4/3] bg-gray-200"></div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3 mt-1"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-4"></div>
        <hr className="border-gray-100 mb-4 mt-auto" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-12"></div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-3 bg-gray-200 rounded-md w-10"></div>
            <div className="h-6 bg-gray-200 rounded-md w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DirectoryGrid({ listings, onSelectListing, isLoading = false, hasMore = false }: DirectoryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local Sort state
  const [sortOption, setSortOption] = useState('recommended');

  const selectedCategories = searchParams.getAll('category');

  const toggleCategory = (cat: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(cat)) {
      newCategories.delete(cat);
    } else {
      newCategories.add(cat);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    newCategories.forEach(c => params.append('category', c));
    params.delete('page'); // reset page when filters change
    
    // Next.js yönlendirmesi ile URL güncellenir
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const loadMore = () => {
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (currentPage + 1).toString());
    
    // Next.js push yöntemiyle sayfayı güncelliyoruz
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Derive categories from all loaded listings
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    listings.forEach(l => l.categories.forEach(c => cats.add(c)));
    return Array.from(cats);
  }, [listings]);

  // Apply Client-Side Filter (if categories selected)
  const filteredListings = useMemo(() => {
    let filtered = [...listings];
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(l => 
        l.categories.some(c => selectedCategories.includes(c))
      );
    }

    // Apply Client-Side Sort
    if (sortOption === 'price_asc') {
      filtered.sort((a, b) => a.price_try - b.price_try);
    } else if (sortOption === 'price_desc') {
      filtered.sort((a, b) => b.price_try - a.price_try);
    } else if (sortOption === 'rating_desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [listings, selectedCategories, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (1/4 width on desktop) */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Filtreler</h3>
            
            {/* Categories */}
            <div className="mb-0">
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Kategoriler</h4>
              {allCategories.length === 0 && isLoading ? (
                <div className="animate-pulse flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="peer w-5 h-5 appearance-none border border-gray-300 rounded focus:ring-2 focus:ring-orange-500/20 checked:bg-orange-500 checked:border-orange-500 transition-all" 
                        />
                        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </aside>

        {/* Listings Grid (3/4 width on desktop) */}
        <div className="w-full lg:w-3/4 flex flex-col">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">
              <strong className="text-gray-900">{filteredListings.length}</strong> rota bulundu
            </span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
            >
              <option value="recommended">Önerilen Sıralama</option>
              <option value="price_asc">Fiyata Göre (Artan)</option>
              <option value="price_desc">Fiyata Göre (Azalan)</option>
              <option value="rating_desc">Puana Göre (Yüksekten Düşüğe)</option>
            </select>
          </div>

          {/* Grid Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onClick={onSelectListing} />
            ))}
            
            {isLoading && Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={`skeleton-${i}`} />)}
          </div>

          {/* Fallback */}
          {!isLoading && filteredListings.length === 0 && (
            <div className="py-20 text-center w-full bg-white rounded-xl border border-gray-100 mt-4">
              <p className="text-gray-500 text-lg">Bu kategoride henüz bir tur bulunmuyor.</p>
            </div>
          )}

          {/* Pagination */}
          {hasMore && filteredListings.length > 0 && (
            <div className="mt-12 flex justify-center">
               <button 
                onClick={loadMore}
                disabled={isLoading}
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center min-w-[200px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : "Daha Fazla İncele"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}