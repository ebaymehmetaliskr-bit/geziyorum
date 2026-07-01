import Link from 'next/link';
import { Compass, Map, FileText, Calendar } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 h-16 flex items-center px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <Compass className="w-6 h-6 text-orange-500" />
          GEZİYORUM
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-600">
          <Link href="/destinasyon/ege-bolgesi" className="hover:text-orange-500 transition-colors">Destinasyonlar</Link>
          <Link href="/harita" className="hover:text-orange-500 transition-colors flex items-center gap-1"><Map className="w-4 h-4"/> Harita</Link>
          <Link href="/rota-planlayici" className="hover:text-orange-500 transition-colors flex items-center gap-1"><Compass className="w-4 h-4"/> Planlayıcı</Link>
          <Link href="/blog" className="hover:text-orange-500 transition-colors flex items-center gap-1"><FileText className="w-4 h-4"/> Blog</Link>
        </nav>
      </div>
    </header>
  );
}