"use client";

import React from "react";
import Link from "next/link";
import { TourListing } from "../types";
import { LazyImage } from "./LazyImage";
import { MapPin, Clock, Star } from "lucide-react";

interface ListingCardProps {
  listing: TourListing;
  onClick: (listing: TourListing) => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const CardContent = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        <LazyImage 
          src={listing.featured_image} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
          {listing.rating.toFixed(1)}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2 uppercase tracking-wide font-medium">
          <MapPin className="w-3 h-3" />
          {listing.location?.province}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {listing.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{listing.description}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm gap-1">
            <Clock className="w-4 h-4" />
            {listing.duration_days}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Başlangıç</div>
            <div className="text-lg font-bold text-orange-600">{listing.display_price}</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link 
      href={`/tour/${listing.id}`}
      className="cursor-pointer rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group block text-left"
    >
      {CardContent}
    </Link>
  );
}