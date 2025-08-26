import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                border: '1px solid #ccc', 
                padding: '1rem', 
                borderRadius: '4px' 
              }}
            >
              <h3>{product.name}</h3>
              <h4>{product.category}</h4>
              <p>Price: ${product.unit_price.toFixed(2)}</p>
              <p>Stock: {product.stock_quantity}</p>
              <p>
                Status: {product.stock_quantity > 0 ? 
                  <span style={{ color: 'green' }}>In Stock</span> : 
                  <span style={{ color: 'red' }}>Out of Stock</span>
                }
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;