import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserMenu() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button 
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all text-sm font-medium"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Giriş Yap</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-gray-200 hover:shadow-md transition-all bg-white"
      >
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-xs font-bold text-gray-900 leading-none">Hesabım</span>
          <span className="text-[10px] text-gray-500">Kullanıcı menüsü</span>
        </div>
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'Kullanıcı'} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full bg-gray-100 object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-4 h-4 text-orange-600" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 mb-2">
            <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || user.email}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link to="/profil/favoriler" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
            <Heart className="w-4 h-4" />
            Favorilerim ("Wishlist")
          </Link>
          <Link to="/profil/rezervasyonlar" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
            <Calendar className="w-4 h-4" />
            Rezervasyonlarım
          </Link>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button 
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
