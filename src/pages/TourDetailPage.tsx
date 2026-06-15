import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TourListing } from '../types';
import { getTourByIdFromWordPress } from '../services/wp-api';
import { SingleListingLayout } from '../components/SingleListingLayout';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<TourListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getTourByIdFromWordPress(id).then(data => {
        setListing(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tur Bulunamadı</h2>
        <p className="text-gray-500 mb-8">Aradığınız tur sayfası mevcut değil veya kaldırılmış olabilir.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return <SingleListingLayout listing={listing} onBack={() => navigate('/')} />;
}
