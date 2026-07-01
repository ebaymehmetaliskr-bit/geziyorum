"use client";

import { Compass, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings, SiteSettings } from '../services/wp-api';

export function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then((settings) => {
      if (settings) {
        setSiteSettings(settings);
      }
    });
  }, []);

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {siteSettings?.site_logo_url ? (
                <img src={siteSettings.site_logo_url} alt="Logo" referrerPolicy="no-referrer" className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <Compass className="w-8 h-8 text-orange-500" />
                  <span className="text-xl font-bold text-white uppercase tracking-wider">
                    {siteSettings?.name || 'Geziyorum'}
                  </span>
                </>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {siteSettings?.footer_text || 'Türkiye\'nin eşsiz güzelliklerini keşfetmek için en kapsamlı rehberiniz. Rotalar, mekanlar ve konaklama önerileriyle seyahat planlamanızı kolaylaştırıyoruz.'}
            </p>
            <div className="flex items-center gap-4">
              <a href={siteSettings?.social_instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={siteSettings?.social_facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={siteSettings?.social_twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              {siteSettings?.footer_links?.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-orange-500 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <span className="text-gray-400 whitespace-pre-line">{siteSettings?.contact_address || 'Beşiktaş, İstanbul\nTürkiye'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">{siteSettings?.contact_phone || '+90 (212) 555 0123'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">{siteSettings?.contact_email || 'iletisim@geziyorum.com'}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Yasal Bilgiler</h4>
            <ul className="space-y-3">
              {siteSettings?.legal_links?.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-orange-500 transition-colors">{link.title}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-gray-800 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>Güvenli ve şeffaf hizmet politikası.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {siteSettings?.name || 'Geziyorum'}. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            Türkiye'de <Heart className="w-4 h-4 text-red-500" /> ile geliştirildi.
          </p>
        </div>
      </div>
    </footer>
  );
}