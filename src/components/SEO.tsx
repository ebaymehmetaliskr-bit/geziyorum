import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  id?: string;
  defaultTitle?: string;
  defaultDesc?: string;
}

export const SEO: React.FC<SEOProps> = ({ id, defaultTitle, defaultDesc }) => {
  const localSeo = JSON.parse(localStorage.getItem('geziyorum_seo') || '{}');
  
  let title = defaultTitle || 'Geziyorum Türkiye';
  let description = defaultDesc || 'Türkiye\'nin güzelliklerini keşfedin.';
  
  if (id && localSeo[id]) {
    title = localSeo[id].metaTitle || title;
    description = localSeo[id].metaDesc || description;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
