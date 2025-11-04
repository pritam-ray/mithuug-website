import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-ochre-100 shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-br from-ochre-100 to-ochre-50"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-3">
        {/* Title */}
        <div className="h-6 bg-ochre-100 rounded-lg w-3/4"></div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-ochre-50 rounded w-full"></div>
          <div className="h-4 bg-ochre-50 rounded w-5/6"></div>
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="h-8 bg-ochre-100 rounded-lg w-24"></div>
          <div className="h-10 bg-ochre-100 rounded-full w-32"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
