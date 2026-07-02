"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import Link from 'next/link';
import { Compass, Calendar, Clock, Share2, Facebook, Twitter, MapPin, ChevronRight } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { NewsletterSubscription } from '@/components/NewsletterSubscription';
import { getBlogPostBySlugFromWordPress, getBlogPostsFromWordPress, BlogPost } from '@/services/wp-api';
import { SEO } from '@/components/SEO';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const articleRef = useRef<HTMLElement>(null);
  const [readingTime, setReadingTime] = useState(5);
  const [headings, setHeadings] = useState<{ id: string, text: string, level: string }[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      setCurrentUrl(window.location.href);
    }
    
    async function loadPost() {
      setIsLoading(true);
      if (slug) {
        const fetchedPost = await getBlogPostBySlugFromWordPress(slug);
        setPost(fetchedPost);
        
        // Popüler içerikler için fallback veri çekimi
        const top = await getBlogPostsFromWordPress(3, '');
        setPopularPosts(top);
      }
      setIsLoading(false);
    }
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (!isLoading && post && articleRef.current) {
      const elements = Array.from(articleRef.current.querySelectorAll('h2, h3')) as HTMLElement[];
      const parsedHeadings = elements.map((el, index) => {
        let id = el.id;
        if (!id) {
          id = `heading-${index}`;
          el.id = id;
        }
        return {
          id,
          text: el.textContent || '',
          level: el.tagName.toLowerCase()
        };
      });
      setHeadings(parsedHeadings);

      const text = articleRef.current.innerText || '';
      const wordCount = text.trim().split(/\s+/).length;
      const wpm = 220; 
      const time = Math.ceil(wordCount / wpm);
      setReadingTime(time > 0 ? time : 1);
    }
  }, [isLoading, post]);

  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 120;
      
      let currentActiveId = '';
      for (const el of headingElements) {
        if (el && el.offsetTop <= scrollPosition) {
          currentActiveId = el.id;
        }
      }
      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center text-center px-4 bg-slate-50">
         <h1 className="text-3xl tracking-tight font-bold text-slate-900 mb-4">İçerik Bulunamadı</h1>
         <p className="text-slate-500 mb-8 max-w-md mx-auto">Aradığınız sayfaya ulaşılamıyor, yayından kaldırılmış veya URL değişmiş olabilir.</p>
         <Link href="/blog" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">
           Blog'a Dön
         </Link>
      </div>
    );
  }

  const generatedTitle = post.title || 'Gezi Rehberi';

  return (
    <div className="pt-20 bg-white font-sans">
      <SEO id={post.id.toString()} defaultTitle={`${generatedTitle} | Geziyorum`} defaultDesc={post.excerpt} />
      
      {/* Breadcrumb Paneli */}
      <div className="bg-slate-50 border-b border-slate-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-2 text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">{generatedTitle}</span>
        </div>
      </div>

      {/* Hero Başlık Alanı */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <MapPin className="w-3.5 h-3.5" /> {post.categoryName}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight" dangerouslySetInnerHTML={{ __html: post.title }}></h1>
        <div className="flex items-center justify-center gap-6 text-slate-500 text-sm font-semibold border-y border-slate-100 py-3 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" /> {post.date}
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" /> {readingTime} Dk Okuma
          </div>
        </div>
      </header>

      {/* Büyük Kapak Görseli */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="aspect-[21/9] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm relative">
          <LazyImage src={post.img} alt={generatedTitle} wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sol: Makale Detay Metni */}
          <article ref={articleRef} className="lg:w-2/3 prose prose-base md:prose-lg prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 leading-relaxed text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Sağ Sidebar: Navigasyon ve Ek Alanlar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Dinamik İçindekiler Paneli (Wanderlog / Lonely Planet Tarzı) */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                   Bu Yazıda Neler Var?
                </h3>
                <nav className="space-y-2.5 border-l-2 border-slate-200/80">
                  {headings.length > 0 ? (
                    headings.map(h => (
                      <a 
                        key={h.id}
                        href={`#${h.id}`} 
                        className={`block transition-all text-xs font-semibold pl-4 -ml-[2px] border-l-2 border-transparent ${
                          h.level === 'h3' ? 'pl-7 text-slate-500' : 'text-slate-600'
                        } ${
                          activeId === h.id ? 'text-orange-600 font-bold border-orange-500 scale-[1.01]' : 'hover:text-orange-500'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) {
                            window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' });
                          }
                        }}
                      >
                        {h.text}
                      </a>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs pl-4 font-medium">İçerik başlıkları derleniyor...</p>
                  )}
                </nav>
              </div>

              {/* Rota Paylaşım Modülü */}
              <div className="bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 text-center">
                <h3 className="text-lg font-bold mb-2 tracking-tight">Bu Rehberi Beğendiniz mi?</h3>
                <p className="text-slate-400 text-xs mb-5 font-medium">Sosyal medya ağlarında paylaşarak seyahat planlayan arkadaşlarınızla paylaşın.</p>
                <div className="flex justify-center gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* Benzer İçerikler Bölümü */}
        <div className="mt-20 border-t border-slate-200/60 pt-12">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">İlginizi Çekebilecek Diğer Tavsiyeler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map((popPost) => (
              <Link href={`/blog/${popPost.slug}`} key={popPost.id} className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                <div className="w-full aspect-[16/10] bg-slate-50 relative overflow-hidden">
                  <LazyImage src={popPost.img} alt={popPost.title} wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md uppercase self-start mb-3">{popPost.categoryName || 'Rehber'}</span>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2" dangerouslySetInnerHTML={{ __html: popPost.title }}></h4>
                  <div className="text-xs text-slate-400 font-semibold mt-auto">{popPost.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <NewsletterSubscription />
      </div>
    </div>
  );
}