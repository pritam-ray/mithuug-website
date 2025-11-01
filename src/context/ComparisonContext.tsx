import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/database';
import { useToast } from './ToastContext';

interface ComparisonContextType {
  comparisonItems: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const { showToast } = useToast();
  const maxItems = 4; // Maximum products to compare

  const addToComparison = (product: Product) => {
    if (comparisonItems.length >= maxItems) {
      showToast('error', `You can only compare up to ${maxItems} products at a time`);
      return;
    }

    if (isInComparison(product.id)) {
      showToast('info', 'Product already in comparison');
      return;
    }

    setComparisonItems(prev => [...prev, product]);
    showToast('success', `${product.name} added to comparison`);
  };

  const removeFromComparison = (productId: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInComparison = (productId: string): boolean => {
    return comparisonItems.some(item => item.id === productId);
  };

  const clearComparison = () => {
    setComparisonItems([]);
    showToast('info', 'Comparison cleared');
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonItems,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
        maxItems,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};
