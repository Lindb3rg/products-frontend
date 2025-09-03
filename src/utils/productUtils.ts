import { Product } from '../types';

export const getProductName = (productId: number, products: Product[]) => {
  const product = products.find(p => p.id === productId);
  return product ? product.name : 'Unknown Product';
};

export const getProductPrice = (productId: number, products: Product[]) => {
  const product = products.find(p => p.id === productId);
  return product ? product.unit_price : 0;
};

export const getAvailableStock = (productId: number,products: Product[]) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock_quantity : 0;
  };