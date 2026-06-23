import { MapPin, Star } from 'lucide-react';
import { TourListing } from '../types';
import { Link } from 'react-router-dom';
import { LazyImage } from './LazyImage';

interface ListingCardProps {
  listing: TourListing;
  key?: string | number;
  onClick?: (listing: TourListing) => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const CardContent = (
    <>
      {/* Image & Badge */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <LazyImage 
          src={listing.featured_image || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80'} 
          alt={listing.title} 
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm pointer-events-none">
          <span className="text-xs font-semibold text-gray-900">{listing.categories[0]}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
          {listing.title}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm mt-auto">
          <MapPin className="w-4 h-4 mr-1 shrink-0 text-gray-400" />
          <span className="truncate">{listing.location.district}, {listing.location.province}</span>
        </div>

        <hr className="border-gray-100 mb-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-sm font-semibold text-gray-900">{listing.rating}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Kişi Başı</span>
            <span className="text-lg font-bold text-gray-900">{listing.display_price || `₺${listing.price_try}`}</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link 
      to={`/tour/${listing.id}`}
      className="cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-orange-200 transition-all duration-300 flex flex-col group block text-left"
    >
      {CardContent}
    </Link>
  );
}

