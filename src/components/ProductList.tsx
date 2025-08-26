import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

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
    <div style={{ padding: '2rem' }}>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Name
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Price
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Stock
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Category
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id}
                style={{ borderBottom: '1px solid #dee2e6' }}
              >
                <td style={{ padding: '0.75rem' }}>
                  {product.name}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  ${product.unit_price.toFixed(2)}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {product.stock_quantity}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {product.category || 'N/A'}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {product.stock_quantity > 0 ? 
                    <span style={{ color: 'green' }}>In Stock</span> : 
                    <span style={{ color: 'red' }}>Out of Stock</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>

    
  );
  
};

export default ProductList;