import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';

interface ProductUpdateData {
  name: string;
  unit_price: number;
  stock_quantity: number;
  category: string;
}

const UpdateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductUpdateData>({
    name: '',
    unit_price: 0,
    stock_quantity: 0,
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get<string[]>('/categories/');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      unit_price: product.unit_price,
      stock_quantity: product.stock_quantity,
      category: product.category || ''
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number = value;
    
    if (name === 'unit_price' || name === 'stock_quantity') {
      const numValue = parseFloat(value);
      processedValue = isNaN(numValue) ? 0 : numValue;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (formData.unit_price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    if (formData.stock_quantity < 0) {
      setError('Stock quantity cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.patch(`/products/${selectedProduct.id}`, formData);
      
      // Update the product in the list
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...formData }
          : p
      ));
      
      setSelectedProduct(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Product with this name already exists');
      } else if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to update product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelUpdate = () => {
    setSelectedProduct(null);
    setFormData({ name: '', unit_price: 0, stock_quantity: 0, category: '' });
    setError('');
  };

  if (products.length === 0 && !error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Update Product</h2>
        <p>No products available to update.</p>
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Update Product</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>
          {error}
        </div>
      )}

      {!selectedProduct ? (
        <>
          <p>Select a product to update:</p>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '1rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Price</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Stock</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem' }}>${product.unit_price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>{product.stock_quantity}</td>
                  <td style={{ padding: '0.75rem' }}>{product.category || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleProductSelect(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={{ maxWidth: '500px' }}>
          <h3>Update: {selectedProduct.name}</h3>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="unit_price" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Price ($) *
              </label>
              <input
                type="text"
                id="unit_price"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="stock_quantity" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Stock Quantity *
              </label>
              <input
                type="text"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="0"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              
              <button
                type="button"
                onClick={cancelUpdate}
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
          </form>
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

export default UpdateProduct;