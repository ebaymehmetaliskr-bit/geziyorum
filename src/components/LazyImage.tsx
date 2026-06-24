import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  className?: string;
  priority?: boolean;
}

// Güvenli URL kontrolü ve optimizasyonu
const optimizeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  try {
    // Sadece protokol değiştirmesi veya base url düzenlemesi yapılabilir,
    // http içerikleri https yapma denenebilir
    let secureUrl = url;
    if (secureUrl.startsWith('http://')) {
      secureUrl = secureUrl.replace('http://', 'https://');
    }
    return secureUrl;
  } catch (error) {
    return url;
  }
};

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '', 
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const optimizedSrc = optimizeImageUrl(src);

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [optimizedSrc]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${wrapperClassName}`}>
      {/* Skeleton Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state: Elegant Image Not Found Placeholder */}
      {(error || !optimizedSrc) && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <ImageOff className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider">Görsel Bulunamadı</span>
        </div>
      )}

      {/* Actual Image */}
      {optimizedSrc && !error && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setError(true);
          }}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
