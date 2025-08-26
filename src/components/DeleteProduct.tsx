import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';

const DeleteProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      await api.delete(`/products/${selectedProduct.id}`);
      
      // Remove the deleted product from the list
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setSelectedProduct(null);
      setShowConfirmation(false);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to delete product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setSelectedProduct(null);
    setShowConfirmation(false);
  };

  if (products.length === 0 && !error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Delete Product</h2>
        <p>No products available to delete.</p>
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
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Delete Product</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>
          {error}
        </div>
      )}

      {!showConfirmation ? (
        <>
          <p>Select a product to delete:</p>
          <div style={{ marginTop: '1rem' }}>
            {products.map((product) => (
              <div 
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => handleProductSelect(product)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      Price: ${product.unit_price.toFixed(2)} | Stock: {product.stock_quantity}
                      {product.category && ` | Category: ${product.category}`}
                    </p>
                  </div>
                  <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Delete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this product?</p>
          
          <div style={{
            border: '2px solid #dc3545',
            padding: '1rem',
            margin: '1rem 0',
            borderRadius: '4px',
            backgroundColor: '#fff5f5'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>
              {selectedProduct?.name}
            </h4>
            <p style={{ margin: 0 }}>
              Price: ${selectedProduct?.unit_price.toFixed(2)} | 
              Stock: {selectedProduct?.stock_quantity}
              {selectedProduct?.category && ` | Category: ${selectedProduct.category}`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={confirmDelete}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            
            <button
              onClick={cancelDelete}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
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

export default DeleteProduct;