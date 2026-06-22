import { motion } from 'motion/react';
import { Search, MapPin, List } from 'lucide-react';
import { LazyImage } from './LazyImage';

export function HeroSection() {
  return (
    <div className="relative min-h-[80vh] md:min-h-screen flex text-center items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src="https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=2000&q=80"
          alt="Türkiye Manzarası"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md"
        >
          Türkiye'nin Gizli Kalmış <br className="hidden md:block" /> Rotalarını Keşfet
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto drop-shadow"
        >
          Doğu'dan Batı'ya keşfedilmeyi bekleyen eşsiz manzaralar, antik kentler ve unutulmaz yerel deneyimler.
        </motion.p>

        {/* Search Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Nereye gitmek istersin?"
              className="w-full focus:outline-none bg-transparent placeholder:text-gray-400 font-medium text-gray-900"
            />
          </div>

          <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 relative">
            <List className="w-5 h-5 text-gray-400 mr-3 shrink-0 absolute left-4" />
            <select className="w-full focus:outline-none bg-transparent text-gray-600 font-medium cursor-pointer appearance-none pl-10">
              <option value="">Kategori Seçin</option>
              <option value="kultur-tarih">Kültür & Tarih</option>
              <option value="doga-macera">Doğa & Macera</option>
              <option value="deniz-yasami">Deniz Yaşamı</option>
              <option value="gastronomi">Gastronomi</option>
            </select>
          </div>

          <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 md:py-3 lg:px-10 rounded-xl md:rounded-full font-bold transition-colors flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            <span>Ara</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
