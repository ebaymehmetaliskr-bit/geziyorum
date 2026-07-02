"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Haritayı SSR (Sunucu Tarafı) derlemesinden tamamen muaf tutuyoruz.
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">İnteraktif Modül Yükleniyor...</span>
      </div>
    )
  }
);

export default function MapPage() {
  return <MapComponent />;
}