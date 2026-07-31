import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  schema,
}) => {
  const siteUrl = 'https://stackadda.me';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const defaultImage = `${siteUrl}/favicon.png`; // Fallback image

  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{title ? `${title} | Stack Adda` : 'Stack Adda'}</title>
      <meta name="description" content={description || 'Stack Adda - Your Ultimate Learning Platform'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title || 'Stack Adda'} />
      <meta property="og:description" content={description || 'Stack Adda - Your Ultimate Learning Platform'} />
      <meta property="og:image" content={ogImage || defaultImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title || 'Stack Adda'} />
      <meta name="twitter:description" content={description || 'Stack Adda - Your Ultimate Learning Platform'} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
