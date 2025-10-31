import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  sku: string;
  price: number;
  currency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
}

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  image,
  sku,
  price,
  currency = 'INR',
  availability = 'https://schema.org/InStock',
  rating = 4.9,
  reviewCount = 287,
  brand = 'MitthuuG',
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    image,
    description,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: currency,
      price: price.toString(),
      priceValidUntil: '2025-12-31',
      availability,
      seller: {
        '@type': 'Organization',
        name: brand,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  url,
  logo,
  description,
  sameAs = [],
  contactEmail,
  contactPhone,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
    ...(contactEmail || contactPhone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            ...(contactEmail && { email: contactEmail }),
            ...(contactPhone && { telephone: contactPhone }),
            contactType: 'Customer Service',
          },
        }
      : {}),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const FAQSchema: React.FC<FAQSchemaProps> = ({ questions }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const BreadcrumbSchema: React.FC<{ items: Array<{ name: string; url: string }> }> = ({
  items,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default {
  ProductSchema,
  OrganizationSchema,
  FAQSchema,
  BreadcrumbSchema,
};
