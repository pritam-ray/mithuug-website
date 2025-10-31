import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'MitthuuG - Premium Til-Gud (Sesame & Jaggery) Bites | Authentic Indian Sweets',
  description = 'Discover MitthuuG - artisan-crafted Til-Gud bites made with premium sesame seeds and pure jaggery. FSSAI certified, 100% natural, no preservatives. Order authentic Indian sweets online.',
  keywords = 'til gud, sesame jaggery, indian sweets, traditional sweets, healthy snacks, FSSAI certified, natural sweets, artisan sweets, MitthuuG, buy til gud online',
  ogImage = 'https://pritam-ray.github.io/mithuug-website/og-image.jpg',
  ogType = 'website',
  canonicalUrl = 'https://pritam-ray.github.io/mithuug-website/'
}) => {
  const fullTitle = title.includes('MitthuuG') ? title : `${title} | MitthuuG`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="MitthuuG" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="MitthuuG Foods Pvt. Ltd." />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data for Products */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MitthuuG",
          "description": "Premium artisan-crafted Til-Gud (sesame & jaggery) bites",
          "url": "https://pritam-ray.github.io/mithuug-website/",
          "logo": "https://pritam-ray.github.io/mithuug-website/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-98765-43210",
            "contactType": "Customer Service",
            "email": "hello@mitthuug.com"
          },
          "sameAs": [
            "https://instagram.com/mitthuug",
            "https://facebook.com/mitthuug"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
